import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/40">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[40px] border border-border shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform text-center mx-auto">V</div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Login to manage your vacant spots.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="name@example.com" required />
            <div className="space-y-1">
              <Input label="Password" type="password" placeholder="••••••••" required />
              <div className="flex justify-end">
                <Link href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
            </div>
          </div>

          <Button className="w-full h-12 rounded-xl text-lg">Sign In</Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" className="rounded-xl h-12">Google</Button>
           <Button variant="outline" className="rounded-xl h-12">Apple</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
