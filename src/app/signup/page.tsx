import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/40">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[40px] border border-border shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform text-center mx-auto">V</div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground">Join Abuja&apos;s most trusted housing platform.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <Input label="Full Name" type="text" placeholder="John Doe" required />
            <Input label="Email Address" type="email" placeholder="name@example.com" required />
            <Input label="Password" type="password" placeholder="••••••••" required />
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <input type="radio" name="role" id="renter" defaultChecked className="w-4 h-4 text-primary" />
                <label htmlFor="renter" className="text-sm font-medium">I&apos;m looking for a home</label>
             </div>
             <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <input type="radio" name="role" id="agent" className="w-4 h-4 text-primary" />
                <label htmlFor="agent" className="text-sm font-medium">I&apos;m a landlord/agent</label>
             </div>
          </div>

          <Button className="w-full h-12 rounded-xl text-lg">Get Started</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
        </p>

        <p className="text-[10px] text-center text-muted-foreground/60 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
