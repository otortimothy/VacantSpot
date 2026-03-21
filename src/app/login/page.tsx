"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Pass email and password to the login function
      login(formData.email, formData.password);

      // Redirect to home
      router.push("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (email: string, pass: string) => {
    setFormData({ email, password: pass });
  };

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

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="name@example.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <div className="space-y-1">
              <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
              <div className="flex justify-end">
                <Link href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Mock Access (MVP Only)</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleMockLogin("admin@vacantspot.com", "admin123")}
              className="text-[10px] py-2 bg-white dark:bg-slate-700 hover:bg-primary/10 border border-border rounded-lg transition-colors font-bold"
            >
              Admin
            </button>
            <button 
              onClick={() => handleMockLogin("agent@vacantspot.com", "agent123")}
              className="text-[10px] py-2 bg-white dark:bg-slate-700 hover:bg-primary/10 border border-border rounded-lg transition-colors font-bold"
            >
              Agent
            </button>
            <button 
              onClick={() => handleMockLogin("user@example.com", "user123")}
              className="text-[10px] py-2 bg-white dark:bg-slate-700 hover:bg-primary/10 border border-border rounded-lg transition-colors font-bold"
            >
              Renter
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm">Google</Button>
           <Button variant="outline" className="rounded-xl h-12 shadow-sm">Apple</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
