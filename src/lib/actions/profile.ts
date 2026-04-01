"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const business_name = formData.get("business_name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = formData.get("avatar_url") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      phone,
      business_name,
      location,
      bio,
      avatar_url,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/profile");
  revalidatePath(`/landlord/${user.id}`);
}

export async function getLandlordProfile(id: string) {
  const supabase = await createClient();
  
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError) {
    console.error("Get profile error:", profileError);
    return null;
  }

  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select("*")
    .eq("landlord_id", id)
    .order("created_at", { ascending: false });

  if (propertiesError) {
    console.error("Get properties error:", propertiesError);
  }

  return {
    ...profile,
    properties: properties || [],
  };
}
