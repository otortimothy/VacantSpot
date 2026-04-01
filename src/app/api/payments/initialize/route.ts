import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const SUBSCRIPTION_AMOUNT = 10000; // ₦10,000

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.has_paid) {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    // 1. Generate unique reference
    const reference = `VACANTSPOT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 2. Insert into payments table
    const { error: dbError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: SUBSCRIPTION_AMOUNT,
      status: "pending",
      reference,
    });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 3. Call Paystack API
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        amount: SUBSCRIPTION_AMOUNT * 100, // Paystack amount is in kobo
        reference: reference,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payments/verify`,
        metadata: {
          user_id: user.id
        }
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message);
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
