"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  revalidatePath(`/properties/${propertyId}`);
}

export async function approveProperty(formData: FormData) {
  "use server";
  const propertyId = formData.get("property_id") as string;
  const notes = formData.get("notes") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
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

  const { error } = await supabase
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

  const { error } = await supabase
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

  const { error } = await supabase
    .from("profiles")
    .update({ is_suspended: false })
    .eq("id", landlordId);

  if (error) {
    console.error("Unsuspend landlord error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}
