import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
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

        <div className="bg-white dark:bg-slate-900/50 p-8 md:p-12 rounded-[40px] border border-border shadow-2xl">
          <ProfileForm user={userData} />
        </div>
      </div>
    </div>
  );
}
