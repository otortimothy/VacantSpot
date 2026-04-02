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
