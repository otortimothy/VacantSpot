"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Property {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason: string | null;
}

interface Inquiry {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_email: string;
  message: string;
  status: string;
  created_at: string;
}

interface DashboardClientProps {
  initialProperties: Property[];
  inquiries: Inquiry[];
}

const statusConfig = {
  verified: { label: "Verified", classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pending: { label: "Pending Review", classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

export default function DashboardClient({ initialProperties, inquiries }: DashboardClientProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries">("listings");

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) {
      setProperties(properties.filter(p => p.id !== id));
    }
    setDeletingId(null);
  };

  const pendingCount = properties.filter(p => p.status === "pending").length;
  const verifiedCount = properties.filter(p => p.status === "verified").length;
  const rejectedCount = properties.filter(p => p.status === "rejected").length;
  const pendingInquiries = inquiries.filter(i => i.status === "pending").length;

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-bold tracking-tight">Landlord Dashboard</h1>
           <p className="text-muted-foreground text-lg">Manage your property listings and tenant inquiries.</p>
        </div>
        <Link href="/dashboard/new">
          <Button size="lg" className="rounded-xl shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Listing
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl space-y-2">
            <p className="text-primary-foreground/70 font-bold uppercase tracking-widest text-[10px]">Total Listings</p>
            <h3 className="text-5xl font-black">{properties.length}</h3>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">By Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Verified</span>
                <span className="font-black text-green-600">{verifiedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Review</span>
                <span className="font-black text-amber-500">{pendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rejected</span>
                <span className="font-black text-red-500">{rejectedCount}</span>
              </div>
            </div>
          </div>
          {pendingInquiries > 0 && (
            <div
              className="p-5 rounded-2xl bg-primary/5 border border-primary/20 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveTab("inquiries")}
            >
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">New Inquiries</p>
              <p className="text-3xl font-black">{pendingInquiries}</p>
              <p className="text-xs text-muted-foreground mt-1">tap to view →</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-border gap-1">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all ${activeTab === "listings" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${activeTab === "inquiries" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Inquiries
              {pendingInquiries > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingInquiries}
                </span>
              )}
            </button>
          </div>

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed border-border text-muted-foreground space-y-3">
                  <div className="text-4xl">🏠</div>
                  <p className="font-bold">No listings yet.</p>
                  <p className="text-sm">Start by adding your first property.</p>
                </div>
              ) : (
                properties.map((property) => {
                  const status = statusConfig[property.status] || statusConfig.pending;
                  return (
                    <div key={property.id} className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border hover:border-primary/50 transition-all flex gap-4 md:items-start">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                        {property.imageUrl && (
                          <Image src={property.imageUrl} alt={property.title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h5 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{property.title}</h5>
                        <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${status.classes}`}>
                            {status.label}
                          </span>
                          <span className="text-sm font-bold text-primary">₦{property.price.toLocaleString()}</span>
                        </div>
                        {property.status === "rejected" && property.rejectionReason && (
                          <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-2.5 rounded-lg mt-1">
                            <span className="font-bold">Rejection reason:</span> {property.rejectionReason}
                          </div>
                        )}
                        {property.status === "pending" && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            ⏳ Awaiting VacantSpot admin review before going live.
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {deletingId === property.id ? (
                          <span className="text-xs font-bold text-red-500 animate-pulse">Deleting...</span>
                        ) : (
                          <>
                            <Link href={`/dashboard/edit/${property.id}`}>
                              <Button variant="outline" size="sm" className="rounded-lg w-full">Edit</Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed border-border text-muted-foreground space-y-3">
                  <div className="text-4xl">📭</div>
                  <p className="font-bold">No inquiries yet.</p>
                  <p className="text-sm">When tenants request inspections, they'll appear here.</p>
                </div>
              ) : (
              inquiries.map((inquiry) => {
                  const relatedProperty = properties.find(p => p.id === inquiry.property_id);
                  const mailtoLink = `mailto:${inquiry.tenant_email}?subject=Re: Inspection Request for ${encodeURIComponent(relatedProperty?.title || "your inquiry")}&body=Hi ${encodeURIComponent(inquiry.tenant_name)},%0D%0A%0D%0AThank you for your interest in ${encodeURIComponent(relatedProperty?.title || "my property")}.%0D%0A%0D%0A`;
                  return (
                    <div key={inquiry.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border hover:border-primary/30 transition-all space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-base">{inquiry.tenant_name}</p>
                          <p className="text-xs text-primary font-bold">{inquiry.tenant_email}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          inquiry.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : inquiry.status === "responded"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl italic">"{inquiry.message}"</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Re: <span className="font-bold text-foreground">{relatedProperty?.title || "Unknown Property"}</span></span>
                        <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1 border-t border-border">
                        <a
                          href={mailtoLink}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black hover:opacity-90 transition-opacity"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Reply via Email
                        </a>
                        <a
                          href={`tel:${inquiry.tenant_email}`}
                          className="px-4 py-2.5 bg-muted text-foreground rounded-xl text-xs font-black hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Copy Email
                        </a>
                      </div>
                    </div>
                  );
                })

              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
