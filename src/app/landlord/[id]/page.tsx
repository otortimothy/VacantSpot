import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/ui/PropertyCard";
import { notFound } from "next/navigation";

export default async function LandlordProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) notFound();

  // Fetch only verified properties for public view
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("landlord_id", id)
    .eq("status", "verified")
    .order("created_at", { ascending: false });

  const landlord = { ...profile, properties: properties || [] };

  // Reputation metrics
  const totalListings = landlord.properties.length;
  const verifiedCount = totalListings; // all fetched are verified
  const isTrustedPartner = verifiedCount >= 3;

  const mappedProperties = landlord.properties.map((p: any) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    address: p.address,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    imageUrl: p.image_urls?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    verifiedAt: p.verified_at || null,
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-24">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[40px] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 bg-primary/10 flex items-center justify-center">
            {landlord.avatar_url ? (
              <Image src={landlord.avatar_url} alt={landlord.name || "Avatar"} fill className="object-cover" />
            ) : (
              <span className="text-6xl font-black text-primary">
                {landlord.name?.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                  {landlord.name}
                </h1>
                {landlord.is_verified && (
                  <div className="bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Partner
                  </div>
                )}
                {isTrustedPartner && (
                  <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    ⭐ Trusted Partner
                  </div>
                )}
              </div>
              <p className="text-xl text-primary font-bold">{landlord.business_name || "Independent Landlord"}</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl text-center min-w-[80px]">
                <p className="text-2xl font-black text-primary">{totalListings}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Listings</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl text-center min-w-[80px]">
                <p className="text-2xl font-black text-green-600">{verifiedCount}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl text-center min-w-[80px]">
                <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{new Date(landlord.created_at).getFullYear()}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Since</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-slate-500 font-medium text-sm">
              <span className="flex items-center gap-1.5">📍 {landlord.location || "Abuja, Nigeria"}</span>
            </div>

            {/* Contact via Inquiry only */}
            <div className="pt-2 flex justify-center md:justify-start">
              <a href="#listings">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all">
                  View Listings ↓
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-6xl">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-l-4 border-primary pl-3">About</h2>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-lg">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {landlord.bio || "This landlord hasn't added a biography yet."}
              </p>
            </div>
          </section>

          {/* Reputation */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-l-4 border-primary pl-3">Reputation</h2>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-lg space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Total Properties</span>
                <span className="font-black">{totalListings}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Verified Listings</span>
                <span className="font-black text-green-600">{verifiedCount} ✓</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Member Since</span>
                <span className="font-black">{new Date(landlord.created_at).getFullYear()}</span>
              </div>
              {isTrustedPartner && (
                <div className="pt-3 border-t border-border text-center">
                  <span className="text-xs text-blue-600 font-black uppercase tracking-widest">⭐ Trusted Partner Status</span>
                  <p className="text-[10px] text-muted-foreground mt-1">3+ verified properties on platform</p>
                </div>
              )}
            </div>
          </section>

          {/* Contact — inquiry-only, no direct details */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-l-4 border-primary pl-3">Contact</h2>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-lg space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                To protect privacy, contact is handled through our secure inquiry system. Select a property below to request an inspection.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy Protected by VacantSpot
              </div>
            </div>
          </section>
        </div>

        {/* Listings */}
        <div id="listings" className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black tracking-tight">
            Active Listings
            <span className="ml-3 text-base font-bold text-muted-foreground">({totalListings})</span>
          </h2>

          {mappedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mappedProperties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-[40px] bg-slate-200/30 dark:bg-slate-900/30 border-2 border-dashed border-border text-center space-y-4">
              <div className="text-6xl text-slate-300">🏢</div>
              <p className="text-xl font-black text-slate-500">No Active Listings</p>
              <p className="text-slate-400 font-medium">This landlord doesn't have any verified properties right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
