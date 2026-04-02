import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { approveProperty, rejectProperty, suspendLandlord, unsuspendLandlord } from "@/lib/actions/admin";

export default async function AdminPortal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4 p-12 bg-white dark:bg-slate-900 rounded-[40px] border border-red-100 shadow-2xl">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🚫</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-slate-500 max-w-xs mx-auto text-lg font-medium">You do not have administrative privileges to access this portal.</p>
        </div>
      </div>
    );
  }

  // Server action to verify landlord account
  async function verifyLandlord(formData: FormData) {
    "use server";
    const landlordId = formData.get("landlord_id") as string;
    const db = await createClient();
    const { error } = await db
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", landlordId);
    if (error) console.error("Verification failed:", error);
    revalidatePath("/admin");
  }

  // Fetch all data in parallel
  const [
    { data: pendingLandlords },
    { data: verifiedLandlords },
    { data: pendingProperties },
    { data: verifiedProperties },
    { data: rejectedProperties },
    { data: suspendedUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "LANDLORD").eq("has_paid", true).eq("is_verified", false).eq("is_suspended", false).order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("role", "LANDLORD").eq("is_verified", true).eq("is_suspended", false).order("created_at", { ascending: false }).limit(10),
    supabase.from("properties").select("*, profiles!properties_landlord_id_fkey(name, email)").eq("status", "pending").order("created_at", { ascending: false }),
    supabase.from("properties").select("*, profiles!properties_landlord_id_fkey(name, email)").eq("status", "verified").order("verified_at", { ascending: false }).limit(20),
    supabase.from("properties").select("*, profiles!properties_landlord_id_fkey(name, email)").eq("status", "rejected").order("created_at", { ascending: false }).limit(10),
    supabase.from("profiles").select("*").eq("is_suspended", true).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-24">
      <div className="container mx-auto px-6 py-16 space-y-16 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
              Security Operations
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Admin Portal</h1>
            <p className="text-xl text-slate-500 font-medium">Manage landlords, property verifications, and platform integrity.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Pending Landlords", value: pendingLandlords?.length || 0, color: "text-amber-600" },
              { label: "Pending Properties", value: pendingProperties?.length || 0, color: "text-orange-500" },
              { label: "Live Properties", value: verifiedProperties?.length || 0, color: "text-green-600" },
              { label: "Suspended", value: suspendedUsers?.length || 0, color: "text-red-500" },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-border shadow-sm min-w-[110px] text-center">
                <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-1 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 1: Pending Landlord Accounts ===== */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Landlord Verification Queue
          </h2>
          {pendingLandlords && pendingLandlords.length > 0 ? (
            <div className="grid gap-6">
              {pendingLandlords.map((landlord) => (
                <div key={landlord.id} className="group p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-black">{landlord.name}</h3>
                      <p className="text-primary font-bold text-sm">{landlord.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-muted-foreground">Phone: <span className="font-bold text-foreground">{landlord.phone || "Not provided"}</span></div>
                      <div className="text-muted-foreground">Paid: <span className="font-bold text-green-600">₦10,000 ✓</span></div>
                      <div className="text-muted-foreground">Joined: <span className="font-bold text-foreground">{new Date(landlord.created_at).toLocaleDateString()}</span></div>
                      <div><span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-md">Pending Review</span></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 shrink-0">
                    <form action={verifyLandlord}>
                      <input type="hidden" name="landlord_id" value={landlord.id} />
                      <Button type="submit" className="w-full h-12 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center gap-2">
                        Approve & Verify
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </Button>
                    </form>
                    <form action={suspendLandlord}>
                      <input type="hidden" name="landlord_id" value={landlord.id} />
                      <Button type="submit" variant="ghost" className="w-full h-10 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-bold">
                        Suspend Account
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900/40 text-slate-400">
              <div className="text-5xl mb-3 opacity-20">✅</div>
              <p className="font-bold text-lg">Queue is clear</p>
              <p className="text-sm mt-1">No landlords awaiting verification.</p>
            </div>
          )}
        </section>

        {/* ===== SECTION 2: Pending Properties ===== */}
        <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Property Verification Queue
          </h2>
          {pendingProperties && pendingProperties.length > 0 ? (
            <div className="grid gap-6">
              {pendingProperties.map((property: any) => {
                const imageUrl = property.image_urls?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80";
                return (
                  <div key={property.id} className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 transition-all shadow-lg flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 h-36 rounded-2xl overflow-hidden shrink-0 bg-muted">
                      <Image src={imageUrl} alt={property.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-black">{property.title}</h3>
                        <p className="text-muted-foreground text-sm">{property.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          By: <Link href={`/landlord/${property.landlord_id}`} className="text-primary font-bold hover:underline">{property.profiles?.name || "Unknown"}</Link>
                          {" · "}{property.profiles?.email}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>🏠 {property.type}</span>
                        <span>💰 ₦{Number(property.price).toLocaleString()}/yr</span>
                        <span>🛏️ {property.bedrooms} beds</span>
                        <span>🚿 {property.bathrooms} baths</span>
                        <span>📅 {new Date(property.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0 md:min-w-[200px]">
                      <form action={approveProperty}>
                        <input type="hidden" name="property_id" value={property.id} />
                        <input type="hidden" name="notes" value="" />
                        <Button type="submit" className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm">
                          ✓ Approve Property
                        </Button>
                      </form>
                      {/* Reject form with textarea */}
                      <PropertyRejectForm propertyId={property.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900/40 text-slate-400">
              <div className="text-5xl mb-3 opacity-20">🏠</div>
              <p className="font-bold text-lg">No pending properties</p>
              <p className="text-sm mt-1">All submitted properties have been reviewed.</p>
            </div>
          )}
        </section>

        {/* ===== SECTION 3: Live Verified Properties ===== */}
        <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold">Live Verified Properties</h2>
          {verifiedProperties && verifiedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedProperties.map((property: any) => (
                <div key={property.id} className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-500/30 transition-all flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <Image src={property.image_urls?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80"} alt={property.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black truncate">{property.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">By: {property.profiles?.name}</p>
                  </div>
                  <Link href={`/properties/${property.id}`} target="_blank">
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10 bg-slate-50/50 rounded-3xl italic">No verified properties yet.</p>
          )}
        </section>

        {/* ===== SECTION 4: Recently Verified Landlords ===== */}
        <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold">Verified Landlords</h2>
          {verifiedLandlords && verifiedLandlords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedLandlords.map((landlord) => (
                <div key={landlord.id} className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-black truncate">{landlord.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{landlord.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <form action={suspendLandlord}>
                      <input type="hidden" name="landlord_id" value={landlord.id} />
                      <button type="submit" className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-wider px-2">Suspend</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-10 bg-slate-50/50 rounded-3xl">No verified landlords yet.</p>
          )}
        </section>

        {/* ===== SECTION 5: Suspended Users ===== */}
        {suspendedUsers && suspendedUsers.length > 0 && (
          <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-red-500">Suspended Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suspendedUsers.map((user) => (
                <div key={user.id} className="p-5 rounded-[20px] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex items-center justify-between">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-black text-red-900 dark:text-red-300 truncate">{user.name}</h4>
                    <p className="text-xs text-red-500 font-bold truncate">{user.email}</p>
                  </div>
                  <form action={unsuspendLandlord}>
                    <input type="hidden" name="landlord_id" value={user.id} />
                    <button type="submit" className="text-xs text-green-600 hover:text-green-800 font-black uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-slate-900 border border-green-200 rounded-full">
                      Reinstate
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Inline client component for reject form to handle textarea in server page
function PropertyRejectForm({ propertyId }: { propertyId: string }) {
  return (
    <form action={rejectProperty} className="space-y-2">
      <input type="hidden" name="property_id" value={propertyId} />
      <textarea
        name="reason"
        placeholder="Rejection reason (required)..."
        required
        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
      />
      <Button type="submit" variant="outline" className="w-full h-10 rounded-xl border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-sm">
        ✕ Reject Property
      </Button>
    </form>
  );
}
