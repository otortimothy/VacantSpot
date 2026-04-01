import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Button from "@/components/ui/Button";

export default async function AdminPortal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4 p-12 bg-white dark:bg-slate-900 rounded-[40px] border border-red-100 shadow-2xl">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 text-4xl mx-auto mb-6">
            🚫
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-slate-500 max-w-xs mx-auto text-lg font-medium">You do not have administrative privileges to access this portal.</p>
        </div>
      </div>
    );
  }

  // Server action to verify landlord
  async function verifyLandlord(formData: FormData) {
    "use server";
    const landlordId = formData.get("landlord_id") as string;
    
    const db = await createClient();
    const { error } = await db
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", landlordId);
      
    if (error) {
      console.error("Verification failed:", error);
      return;
    }
      
    revalidatePath("/admin");
  }

  // Fetch landlords needing verification
  const { data: pendingLandlords } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "LANDLORD")
    .eq("has_paid", true)
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  // Fetch all other landlords (Verified)
  const { data: verifiedLandlords } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "LANDLORD")
    .eq("is_verified", true)
    .eq("has_paid", true)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-24">
      <div className="container mx-auto px-6 py-16 space-y-16 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
              Security Operations
            </div>
            <h1 className="text-5xl font-black tracking-tight flex items-center gap-4 text-slate-900 dark:text-white">
              Admin Portal
            </h1>
            <p className="text-xl text-slate-500 font-medium">Manage and verify platform landlords securely.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-3xl font-black text-primary">{pendingLandlords?.length || 0}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Pending</span>
             </div>
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-3xl font-black text-green-600">{verifiedLandlords?.length || 0}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Verified</span>
             </div>
          </div>
        </div>

        {/* Pending Queue Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
             <h2 className="text-3xl font-bold flex items-center gap-3">
               <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
               Verification Queue
             </h2>
          </div>
          
          {pendingLandlords && pendingLandlords.length > 0 ? (
            <div className="grid gap-6">
              {pendingLandlords.map((landlord) => (
                <div key={landlord.id} className="group p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity group-hover:opacity-100 opacity-0"></div>
                  
                  <div className="relative z-10 space-y-4">
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{landlord.name}</h3>
                        <p className="text-primary font-bold text-sm">{landlord.email}</p>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                           <span className="opacity-50">Phone:</span>
                           <span className="font-bold text-slate-700 dark:text-slate-300">{landlord.phone || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                           <span className="opacity-50">Paid:</span>
                           <span className="font-bold text-green-600 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                              ₦10,000.00
                           </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                           <span className="opacity-50">Joined:</span>
                           <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(landlord.created_at).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                           <span className="opacity-50">Status:</span>
                           <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-md">Pending Review</span>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 shrink-0">
                    <form action={verifyLandlord}>
                       <input type="hidden" name="landlord_id" value={landlord.id} />
                       <Button type="submit" className="w-full md:w-auto h-16 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-300/50 dark:shadow-none font-bold text-lg flex items-center gap-2">
                         Approve & Verify
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                       </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] bg-white dark:bg-slate-900/40 text-slate-400">
               <div className="text-6xl mb-4 opacity-20">✅</div>
               <p className="text-xl font-bold tracking-tight">Zero Pending Verifications</p>
               <p className="max-w-xs mx-auto mt-2 text-sm">Your queue is currently empty. All landlords have been processed.</p>
            </div>
          )}
        </div>

        {/* Verified List Section */}
        <div className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold">Recently Processed</h2>
          {verifiedLandlords && verifiedLandlords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedLandlords.map((landlord) => (
                <div key={landlord.id} className="p-6 rounded-[28px] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-green-500/30 transition-all">
                  <div className="space-y-1">
                     <h3 className="font-black text-slate-900 dark:text-white truncate max-w-[150px]">{landlord.name}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{landlord.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-12 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl italic">No verified landlords in record.</p>
          )}
        </div>
      </div>
    </div>
  );
}
