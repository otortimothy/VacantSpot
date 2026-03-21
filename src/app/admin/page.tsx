"use client";

import { useProperties } from "@/context/PropertyContext";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const { properties, updateProperty, deleteProperty } = useProperties();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter properties that need verification
  const pendingProperties = properties.filter((p) => !p.isVerified);

  const handleVerify = async (id: string) => {
    setProcessingId(id);
    try {
      // Simulate verification process (e.g., background check)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateProperty(id, { isVerified: true });
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure you want to reject and remove this listing?")) {
      setProcessingId(id);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        deleteProperty(id);
      } catch (err) {
        console.error("Rejection failed:", err);
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight">Admin Moderation Queue</h1>
        <p className="text-muted-foreground text-lg italic">"Curbing the Abuja housing crisis, one verified listing at a time."</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {pendingProperties.length === 0 ? (
           <div className="p-20 text-center space-y-4 bg-muted/30 rounded-[40px] border-2 border-dashed border-border">
              <div className="text-6xl text-muted-foreground/30 font-black tracking-tighter uppercase">Clean Slate</div>
              <p className="text-muted-foreground">All property listings are currently verified. Good job, team!</p>
           </div>
        ) : (
          pendingProperties.map((property) => (
            <div key={property.id} className="p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-border shadow-xl space-y-8 hover:border-primary/30 transition-colors">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="relative w-full lg:w-72 aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Verification Pending
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-bold">{property.title}</h3>
                      <p className="text-xl text-muted-foreground flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.address}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                         <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Price</p>
                         <p className="font-bold">₦{property.price.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                         <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Type</p>
                         <p className="font-bold">{property.type}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                         <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                         <p className="font-bold text-amber-600 text-sm">Action Required</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                         <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Submitted</p>
                         <p className="font-bold italic text-sm">Recently</p>
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 space-y-2">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300">Moderator Note:</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Please contact the field agent to confirm site visit was successful before clicking verify. Verify that images match current GPS metadata.</p>
                   </div>

                   <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <Button 
                        size="lg" 
                        className="rounded-2xl h-14 px-12 group bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        onClick={() => handleVerify(property.id)}
                        disabled={processingId === property.id}
                      >
                         <svg className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                         </svg>
                         {processingId === property.id ? "Verifying..." : "Verify Listing"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-2xl h-14 px-12 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                        onClick={() => handleReject(property.id)}
                        disabled={processingId === property.id}
                      >
                         Reject & Remove
                      </Button>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
