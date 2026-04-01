import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// For the MVP, we use dynamic rendering constantly to catch updates
export const revalidate = 0;

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      profiles!properties_landlord_id_fkey (
        name,
        phone,
        whatsapp,
        email,
        created_at
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
    <div className="container mx-auto px-6 py-12 space-y-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {/* Properties returned by DB query are verified by logic */}
            <div className="absolute top-6 right-6 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Vacant
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
            {/* We will show Whatsapp below, no need for button here */}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🛏️</span>
              <p className="text-sm font-semibold">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🚿</span>
              <p className="text-sm font-semibold">{property.bathrooms} Bathrooms</p>
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

          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {landlord?.name ? landlord.name.charAt(0).toUpperCase() : "V"}
                </div>
                <div>
                   <p className="font-bold text-lg">{landlord?.name || "Verified Agent"}</p>
                   {landlord?.created_at && (
                     <p className="text-xs text-muted-foreground">Joined {new Date(landlord.created_at).toLocaleDateString()}</p>
                   )}
                </div>
             </div>
             
             <div className="space-y-3 pt-4 border-t border-blue-200 dark:border-blue-800">
               <h4 className="text-sm font-black uppercase tracking-widest text-blue-800 dark:text-blue-300">Contact Details</h4>
               {landlord?.phone && (
                 <p className="flex items-center gap-2 font-medium">
                   <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   {landlord.phone}
                 </p>
               )}
               {landlord?.email && (
                 <p className="flex items-center gap-2 font-medium">
                   <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   {landlord.email}
                 </p>
               )}
               
               {landlord?.whatsapp && (
                  <a href={`https://wa.me/${landlord.whatsapp.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(landlord.name)},%20I'm%20interested%20in%20your%20property%20listing:%20${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer" className="block mt-4">
                    <Button className="w-full rounded-xl h-12 bg-green-500 hover:bg-green-600 text-white border-0">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Chat on WhatsApp
                    </Button>
                  </a>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
