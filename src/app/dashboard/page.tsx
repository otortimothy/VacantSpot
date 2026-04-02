import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import PaymentButton from "@/components/PaymentButton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Middleware redirects

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  // Case 0: Suspended account
  if (profile.is_suspended) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-xl">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 text-4xl mb-4">
          🚫
        </div>
        <h1 className="text-4xl font-black tracking-tight text-red-600">Account Suspended</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Your account has been suspended by an administrator. If you believe this is an error, please contact VacantSpot support.
        </p>
      </div>
    );
  }

  // Case 1: has_paid = false
  if (!profile.has_paid) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-2xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">Unlock Your Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            To start posting and managing properties on VacantSpot, landlords must pay a one-time verification fee.
            This helps us ensure only serious agents and owners are active on the platform, keeping bad actors out.
          </p>
        </div>

        <div className="w-full bg-white dark:bg-slate-900 border border-border p-8 rounded-3xl shadow-sm text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h3 className="text-2xl font-bold">Verification Fee</h3>
             <p className="text-muted-foreground mt-1">One-time payment</p>
           </div>
           <div className="text-right">
             <div className="text-4xl font-black text-primary">₦10,000</div>
           </div>
        </div>

        <PaymentButton />
      </div>
    );
  }

  // Case 2: has_paid = true BUT is_verified = false
  if (!profile.is_verified) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-xl">
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Awaiting Verification</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Thank you for your payment! Our admin team is currently reviewing your account details. You will be able to post properties as soon as you are verified.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-bold text-muted-foreground mt-4">
           Status: Pending Admin Review
        </div>
      </div>
    );
  }

  // Case 3: has_paid = true AND is_verified = true — Show dashboard
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch inquiries for all their properties
  const propertyIds = (properties || []).map(p => p.id);
  const { data: inquiries } = propertyIds.length > 0
    ? await supabase
        .from("inquiries")
        .select("*")
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const mappedProperties = (properties || []).map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    address: p.address,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    imageUrl: p.image_urls?.[0] || "",
    status: p.status as "pending" | "verified" | "rejected",
    rejectionReason: p.rejection_reason || null,
  }));

  return (
    <DashboardClient
      initialProperties={mappedProperties}
      inquiries={inquiries || []}
    />
  );
}
