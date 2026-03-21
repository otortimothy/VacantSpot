"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "RENTER" as "RENTER" | "AGENT",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setFormData((prev) => ({ ...prev, role: name === "role" && value === "agent" ? "AGENT" : "RENTER" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      signup({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      // Redirect to dashboard or home
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              label="Full Name" 
              name="name"
              type="text" 
              placeholder="John Doe" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="name@example.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
             <div 
               className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                 formData.role === "RENTER" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-muted/30"
               }`}
               onClick={() => setFormData(p => ({ ...p, role: "RENTER" }))}
             >
                <input 
                  type="radio" 
                  name="role" 
                  id="renter" 
                  value="renter"
                  checked={formData.role === "RENTER"} 
                  onChange={handleChange}
                  className="w-4 h-4 text-primary" 
                />
                <label htmlFor="renter" className="text-sm font-medium cursor-pointer">I&apos;m looking for a home</label>
             </div>
             <div 
               className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                 formData.role === "AGENT" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-muted/30"
               }`}
               onClick={() => setFormData(p => ({ ...p, role: "AGENT" }))}
             >
                <input 
                  type="radio" 
                  name="role" 
                  id="agent" 
                  value="agent"
                  checked={formData.role === "AGENT"} 
                  onChange={handleChange}
                  className="w-4 h-4 text-primary" 
                />
                <label htmlFor="agent" className="text-sm font-medium cursor-pointer">I&apos;m a landlord/agent</label>
             </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-lg"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Get Started"}
          </Button>
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
