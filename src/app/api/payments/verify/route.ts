import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Service-role client bypasses RLS — safe for server-only API routes
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(`${siteUrl}/dashboard?error=MissingReference`);
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Use admin client to bypass RLS — this is a server-only route
    const supabase = createAdminClient();

    if (data.status && data.data?.status === "success") {
      // 1. Update payment record to success
      const { data: dbData, error: paymentError } = await supabase
        .from("payments")
        .update({ status: "success" })
        .eq("reference", reference)
        .select()
        .single();

      if (paymentError) {
        console.error("Payment update error:", paymentError);
        return NextResponse.redirect(`${siteUrl}/dashboard?error=PaymentUpdateFailed`);
      }

      if (dbData) {
        // 2. Mark landlord as having paid
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ has_paid: true })
          .eq("id", dbData.user_id);

        if (profileError) {
          console.error("Profile update error:", profileError);
        }
      }

      // 3. Redirect to profile page so landlord can complete their details
      return NextResponse.redirect(`${siteUrl}/dashboard/profile?payment=success`);
    } else {
      // Payment failed or was abandoned
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.redirect(`${siteUrl}/dashboard?error=PaymentFailed`);
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/dashboard?error=VerificationError`);
  }
}
