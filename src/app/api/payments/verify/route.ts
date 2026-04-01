import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (!reference) {
      return NextResponse.redirect(new URL("/dashboard?error=MissingReference", req.url));
    }

    // Verify payment using Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    // We update status in the database using a service role client to bypass RLS, 
    // or since user is authenticated we just use their own token. Better to use their token if possible
    // Wait, the callback might not have the user's cookie if it's a server-to-server webhook, 
    // but this is a redirect callback where the user's browser makes the GET request, so cookies exist.
    const supabase = await createClient();

    if (data.status && data.data.status === "success") {
      // Payment successful
      const { data: dbData, error } = await supabase
        .from("payments")
        .update({ status: "success" })
        .eq("reference", reference)
        .select()
        .single();
      
      if (!error && dbData) {
        // Update user profile
        await supabase
          .from("profiles")
          .update({ has_paid: true })
          .eq("id", dbData.user_id);
      }

      return NextResponse.redirect(new URL("/dashboard?payment=success", req.url));
    } else {
      // Payment failed or abandoned
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.redirect(new URL("/dashboard?error=PaymentFailed", req.url));
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=VerificationError", req.url));
  }
}
