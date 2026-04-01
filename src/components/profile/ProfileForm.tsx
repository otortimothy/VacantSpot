"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AvatarUpload from "./AvatarUpload";
import { updateProfile } from "@/lib/actions/profile";

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    business_name?: string;
    location?: string;
    bio?: string;
    avatar_url?: string;
  };
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("avatar_url", avatarUrl);

    try {
      await updateProfile(formData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          ✅ Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col items-center pb-8 border-b border-border">
        <AvatarUpload 
          userId={user.id} 
          currentAvatarUrl={avatarUrl} 
          onUploadComplete={(url) => setAvatarUrl(url)} 
        />
        <p className="text-sm text-muted-foreground mt-4 italic">
          Click the button above to upload a new profile picture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Account Information</h3>
          <Input
            label="Email Address (Locked)"
            name="email"
            type="email"
            defaultValue={user.email}
            disabled
            className="bg-muted/50 cursor-not-allowed"
          />
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. John Doe"
            defaultValue={user.name}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+234..."
            defaultValue={user.phone}
            required
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Business Details</h3>
          <Input
            label="Business/Agency Name"
            name="business_name"
            placeholder="e.g. Abuja Realty Group"
            defaultValue={user.business_name}
          />
          <Input
            label="Location/Base"
            name="location"
            placeholder="e.g. Wuse II, Abuja"
            defaultValue={user.location}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Profile Bio</h3>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80 ml-1">About You</label>
          <textarea
            name="bio"
            placeholder="Tell potential tenants about your experience and properties..."
            className="w-full px-4 py-3 rounded-2xl border border-border bg-background min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            defaultValue={user.bio}
          />
        </div>
      </div>

      <div className="pt-8 border-t border-border flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full md:w-auto h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
        >
          {loading ? "Saving Changes..." : "Save Profile Details"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
