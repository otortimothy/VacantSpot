import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InquiryForm from "@/components/InquiryForm";

export const revalidate = 0;

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      profiles!properties_landlord_id_fkey (
        id,
        name,
        avatar_url,
        business_name,
        location,
        bio,
        created_at,
        is_verified
      )
    `)
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  const landlord = property.profiles;
  const imageUrls = property.image_urls && property.image_urls.length > 0
    ? property.image_urls
    : ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"];

  const mainImage = imageUrls[0];

  return (
    <div className="container mx-auto px-6 py-12 space-y-12 max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted border border-border">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover"
            />
            {/* Verification Badge */}
            <div className="absolute top-6 right-6 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified by VacantSpot
            </div>
          </div>

          {imageUrls.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {imageUrls.slice(1, 4).map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted relative overflow-hidden group border border-border">
                  <Image
                    src={url}
                    alt={`View ${i + 2}`}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Verification Info Bar */}
          {property.verified_at && (
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-bold text-green-800 dark:text-green-300">Physically Verified by VacantSpot</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                  Our team confirmed this property on {new Date(property.verified_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </p>
                {property.verification_notes && (
                  <p className="text-xs text-green-700 dark:text-green-400 mt-2 italic">"{property.verification_notes}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {property.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{property.title}</h1>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.address}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-border gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Annual Rent</p>
              <p className="text-4xl font-black text-primary">
                ₦{property.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">per year</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🛏️</span>
              <p className="text-sm font-semibold">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🚿</span>
              <p className="text-sm font-semibold">{property.bathrooms} Bathrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-green-600">Verified</p>
            </div>
          </div>

          {property.description && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">About this Property</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          )}

          {/* Landlord Card — No Contact Info */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-border space-y-4">
            <div className="flex items-center gap-4">
              <Link href={`/landlord/${landlord?.id}`} className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                  {landlord?.avatar_url ? (
                    <Image src={landlord.avatar_url} alt={landlord.name || ""} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    landlord?.name?.charAt(0).toUpperCase() || "V"
                  )}
                </div>
              </Link>
              <div>
                <Link href={`/landlord/${landlord?.id}`} className="hover:text-primary transition-colors">
                  <p className="font-bold text-lg">{landlord?.name || "Verified Agent"}</p>
                </Link>
                {landlord?.business_name && (
                  <p className="text-sm text-muted-foreground">{landlord.business_name}</p>
                )}
                {landlord?.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Partner
                  </span>
                )}
              </div>
            </div>
            <Link href={`/landlord/${landlord?.id}`} className="block">
              <Button variant="outline" size="sm" className="w-full rounded-xl">
                View Full Profile & All Listings →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Section — Replaces all contact exposure */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-border shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request an Inspection</h2>
            <p className="text-muted-foreground">
              Interested in this property? Submit a request and the landlord will reach out to schedule a viewing.
            </p>
          </div>
          <InquiryForm propertyId={property.id} propertyTitle={property.title} />
        </div>
      </div>
    </div>
  );
}
