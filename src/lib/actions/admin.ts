"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { sendInquiryNotification } from "@/lib/email";

export async function submitInquiry(formData: FormData) {
  const propertyId = formData.get("property_id") as string;
  const tenantName = formData.get("tenant_name") as string;
  const tenantEmail = formData.get("tenant_email") as string;
  const message = formData.get("message") as string;

  if (!propertyId || !tenantName || !tenantEmail || !message) {
    throw new Error("All fields are required.");
  }

  if (!tenantEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  if (message.length < 10) {
    throw new Error("Message must be at least 10 characters.");
  }

  const supabase = await createClient();
  const db = createAdminClient();

  // 1. Save inquiry to database
  const { error } = await supabase.from("inquiries").insert({
    property_id: propertyId,
    tenant_name: tenantName.trim(),
    tenant_email: tenantEmail.trim().toLowerCase(),
    message: message.trim(),
    status: "pending",
  });

  if (error) {
    console.error("Inquiry insert error:", error);
    throw new Error("Failed to submit inquiry. Please try again.");
  }

  // 2. Fetch property + landlord details to send email
  const { data: property } = await db
    .from("properties")
    .select("title, address, landlord_id")
    .eq("id", propertyId)
    .single();

  if (property?.landlord_id) {
    const { data: landlord } = await db
      .from("profiles")
      .select("name, email")
      .eq("id", property.landlord_id)
      .single();

    if (landlord?.email) {
      // 3. Send email notification to landlord
      await sendInquiryNotification({
        landlordEmail: landlord.email,
        landlordName: landlord.name || "Landlord",
        seekerName: tenantName.trim(),
        seekerEmail: tenantEmail.trim().toLowerCase(),
        message: message.trim(),
        propertyTitle: property.title,
        propertyAddress: property.address,
        propertyId,
      });
    }
  }

  revalidatePath(`/properties/${propertyId}`);
}



export async function approveProperty(formData: FormData) {
  "use server";
  const propertyId = formData.get("property_id") as string;
  const notes = formData.get("notes") as string;

  // Verify admin identity via cookie-based client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  // Use admin client to bypass RLS for the update
  const db = createAdminClient();
  const { error } = await db
    .from("properties")
    .update({
      status: "verified",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
      verification_notes: notes || null,
      rejection_reason: null,
    })
    .eq("id", propertyId);

  if (error) {
    console.error("Approve property error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function rejectProperty(formData: FormData) {
  "use server";
  const propertyId = formData.get("property_id") as string;
  const reason = formData.get("reason") as string;

  if (!reason || reason.trim().length < 5) {
    throw new Error("A rejection reason is required.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const db = createAdminClient();
  const { error } = await db
    .from("properties")
    .update({
      status: "rejected",
      rejection_reason: reason.trim(),
      verified_at: null,
      verified_by: null,
    })
    .eq("id", propertyId);

  if (error) {
    console.error("Reject property error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function suspendLandlord(formData: FormData) {
  "use server";
  const landlordId = formData.get("landlord_id") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const db = createAdminClient();
  const { error } = await db
    .from("profiles")
    .update({ is_suspended: true })
    .eq("id", landlordId);

  if (error) {
    console.error("Suspend landlord error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function unsuspendLandlord(formData: FormData) {
  "use server";
  const landlordId = formData.get("landlord_id") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const db = createAdminClient();
  const { error } = await db
    .from("profiles")
    .update({ is_suspended: false })
    .eq("id", landlordId);

  if (error) {
    console.error("Unsuspend landlord error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}
