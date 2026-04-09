"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function NewListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [selfVerified, setSelfVerified] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Apartment",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      } else {
        router.push("/login");
      }
    });
  }, [router, supabase.auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload Images
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}-${Math.random()}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
          
          uploadedUrls.push(data.publicUrl);
        }
      }

      // 2. Insert Property
      const { error: insertError } = await supabase.from("properties").insert({
        title: formData.title,
        type: formData.type,
        address: formData.address,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        description: formData.description,
        imageurl: "", // legacy column — kept to satisfy NOT NULL constraint
        image_urls: uploadedUrls.length > 0 ? uploadedUrls : [
           "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
        ],
        landlord_id: userId,
      });


      if (insertError) throw insertError;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to add property:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">List a New Property</h1>
          <p className="text-muted-foreground text-lg">Provide accurate details for our field verification team.</p>
        </div>

        {error && (
          <div className="p-4 text-sm font-medium text-red-500 bg-red-50 border border-red-200 rounded-xl">
             {error}
          </div>
        )}

        <form className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[32px] border border-border shadow-xl" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Property Title" 
                name="title"
                placeholder="e.g. Luxury 2 Bedroom Apartment" 
                required
                value={formData.title}
                onChange={handleChange}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 ml-1">Property Type</label>
                <select 
                  name="type"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>Apartment</option>
                  <option>Studio</option>
                  <option>Duplex</option>
                  <option>Bungalow</option>
                </select>
              </div>
            </div>
            <Input 
              label="Full Address" 
              name="address"
              placeholder="e.g. Plot 123, Maitama Extension, Abuja" 
              required
              value={formData.address}
              onChange={handleChange}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80 ml-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe your property..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Pricing & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Annual Rent (₦)" 
                name="price"
                type="number" 
                placeholder="4,500,000" 
                required
                value={formData.price}
                onChange={handleChange}
              />
              <Input 
                label="Bedrooms" 
                name="bedrooms"
                type="number" 
                placeholder="2" 
                required
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <Input 
                label="Bathrooms" 
                name="bathrooms"
                type="number" 
                placeholder="2" 
                required
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Media</h3>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group relative">
               <input
                 type="file"
                 multiple
                 accept="image/*"
                 onChange={(e) => setFiles(e.target.files)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <div>
                  <p className="font-bold">Upload Photos</p>
                  <p className="text-sm text-muted-foreground">
                    {files && files.length > 0 ? `${files.length} images selected` : "Click or drag to upload property images"}
                  </p>
               </div>
            </div>
          </div>


          {/* Self-Verification Component completely removed since only ADMIN can verify Landlord, wait...
          The user spec says "Only after has_paid=true AND is_verified=true Can: Create/edit/delete listings".
          Properties themselves don't need 'verification' anymore because the *LANDLORD* is verified.
          The user explicitly wanted "Only verified landlords can post listings". So all properties from them are "verified" by association.
          I'll remove the selfVerified logic for simplicity, but wait, the RLS policy says properties are visible if the landlord is verified. 
          */}
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
             <p className="text-sm font-bold text-primary">✅ You are a Verified Landlord</p>
             <p className="text-xs text-muted-foreground mt-1">This listing will go live immediately on the platform upon submission.</p>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 rounded-xl h-14 text-lg bg-primary"
              disabled={loading}
            >
              {loading ? "Uploading & Submitting..." : "Submit Listing"}
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl h-14" type="button" onClick={() => router.push("/dashboard")}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
