import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getLandlordProfile } from "@/lib/actions/profile";
import PropertyCard from "@/components/ui/PropertyCard";
import { notFound } from "next/navigation";

export default async function LandlordProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const landlord = await getLandlordProfile(id);

  if (!landlord) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-24">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[40px] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 bg-primary/10 flex items-center justify-center">
            {landlord.avatar_url ? (
              <Image
                src={landlord.avatar_url}
                alt={landlord.name || "Landlord Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-6xl font-black text-primary">
                {landlord.name?.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
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
              </div>
              <p className="text-xl text-primary font-bold">{landlord.business_name || "Independent Landlord"}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>{landlord.location || "Abuja, Nigeria"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span>{landlord.properties?.length || 0} Listed Properties</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-xl">📅</span>
                <span>Partner since {new Date(landlord.created_at).getFullYear()}</span>
              </div>
            </div>
            
            <div className="pt-4 flex justify-center md:justify-start">
               <Link href={`mailto:${landlord.email}`}>
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                    Contact Agent
                  </button>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-6xl">
        {/* Sidebar: About & Contact */}
        <div className="lg:col-span-1 space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4 uppercase text-xs">About the Landlord</h2>
            <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[140px]">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {landlord.bio || "This landlord hasn't added a biography yet, but they are a trusted member of our community."}
              </p>
            </div>
          </section>

          <section className="space-y-6">
             <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4 uppercase text-xs">Contact Details</h2>
             <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between group">
                   <span className="text-sm text-slate-400 font-bold">Email</span>
                   <span className="text-foreground font-black text-sm group-hover:text-primary transition-colors">{landlord.email}</span>
                </div>
                <div className="flex items-center justify-between group">
                   <span className="text-sm text-slate-400 font-bold">Phone</span>
                   <span className="text-foreground font-black text-sm">{landlord.phone || "Hidden"}</span>
                </div>
             </div>
          </section>
        </div>

        {/* Main Feed: Listings */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black tracking-tight">Active Listings</h2>
          
          {landlord.properties && landlord.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landlord.properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-[40px] bg-slate-200/30 dark:bg-slate-900/30 border-2 border-dashed border-border text-center space-y-4">
               <div className="text-6xl text-slate-300">🏢</div>
               <p className="text-xl font-black text-slate-500">No Active Listings</p>
               <p className="text-slate-400 font-medium">This landlord doesn't have any properties currently available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
