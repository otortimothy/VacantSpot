"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: "LANDLORD",
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if email confirmation is required by this Supabase project
      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Redirect to OTP verification page
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      console.error("DEBUG SIGNUP ERROR:", err);
      if (err.message === "Failed to fetch") {
        setError("Network Error: Could not connect to Supabase. Please check your internet connection or if the Supabase project is active.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
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
          <h1 className="text-3xl font-bold tracking-tight">List Your Property</h1>
          <p className="text-muted-foreground">Create a landlord account to post and manage your listings.</p>
        </div>

        {/* What you get */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-primary">As a Landlord you can</p>
          <ul className="text-sm text-foreground/80 space-y-1">
            <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Post unlimited property listings</li>
            <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Verify & manage listings instantly</li>
            <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Edit or remove listings anytime</li>
          </ul>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-6 text-sm text-green-800 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center space-y-2">
            <p className="font-bold text-lg">Check your email!</p>
            <p>We sent a confirmation link to <strong>{formData.email}</strong> to verify your account.</p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-lg"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Landlord Account"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
        </p>

        <p className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          Just browsing for a home?{" "}
          <Link href="/" className="font-bold text-primary hover:underline">Browse listings →</Link>
        </p>

        <p className="text-[10px] text-center text-muted-foreground/60 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
