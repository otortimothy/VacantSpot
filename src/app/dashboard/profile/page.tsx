import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import Link from "next/link";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const paymentSuccess = params.payment === "success";

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    // This should ideally not happen due to the signup trigger
    return <div>Profile not found.</div>;
  }

  const userData = {
    id: authUser.id,
    email: authUser.email!,
    name: profile.name,
    phone: profile.phone,
    business_name: profile.business_name,
    location: profile.location,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight">Profile Settings</h1>
          <p className="text-xl text-muted-foreground">Manage your public identity and business details.</p>
        </div>

      {paymentSuccess && (
        <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-black text-green-800 dark:text-green-300">Payment Successful! 🎉</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Your ₦10,000 verification fee has been received. While our admin team reviews your account,
              please complete your profile below so tenants can find you.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          <span className="font-black">Pending Admin Review</span> — You'll have full dashboard access once your account is verified.
        </p>
      </div>

        <div className="bg-white dark:bg-slate-900/50 p-8 md:p-12 rounded-[40px] border border-border shadow-2xl">
          <ProfileForm user={userData} />
        </div>
      </div>
    </div>
  );
}
