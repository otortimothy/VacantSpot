"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.id);
      }
    });
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!userId) return;

    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("landlord_id", userId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setFormData({
          title: data.title,
          type: data.type,
          address: data.address,
          price: String(data.price),
          bedrooms: String(data.bedrooms),
          bathrooms: String(data.bathrooms),
          description: data.description || "",
        });
      }
      setFetching(false);
    };

    fetchProperty();
  }, [id, userId, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          title: formData.title,
          type: formData.type,
          address: formData.address,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          description: formData.description,
        })
        .eq("id", id)
        .eq("landlord_id", userId);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Failed to update property:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="text-3xl font-bold">Listing Not Found</h1>
        <p className="text-muted-foreground">The listing you are trying to edit does not exist or you do not have permission to edit it.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold tracking-tight">Edit Property Listing</h1>
          <p className="text-muted-foreground text-lg">Update your property details below.</p>
        </div>

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

          <div className="pt-6 border-t border-border flex flex-col md:flex-row gap-4">
            <Button 
              type="submit"
              size="lg" 
              className="flex-1 rounded-xl h-14 text-lg bg-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl h-14" type="button" onClick={() => router.push("/dashboard")}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
