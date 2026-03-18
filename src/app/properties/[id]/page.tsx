import { MOCK_PROPERTIES } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const property = MOCK_PROPERTIES.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

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
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover"
            />
            {property.isVerified && (
              <div className="absolute top-6 right-6 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Vacant
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted relative overflow-hidden group">
                 <Image
                    src={property.imageUrl}
                    alt={`View ${i}`}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                  />
              </div>
            ))}
          </div>
        </div>

        {/* Info Container */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {property.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{property.title}</h1>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.address}
            </p>
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-border">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Annual Rent</p>
              <p className="text-4xl font-black text-primary">
                ₦{property.price.toLocaleString()}
              </p>
            </div>
            <Button size="lg" className="rounded-2xl px-8 h-14">Check Availability</Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🛏️</span>
              <p className="text-sm font-semibold">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">🚿</span>
              <p className="text-sm font-semibold">{property.bathrooms} Bathrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border text-center space-y-1 shadow-sm">
              <span className="text-2xl">📐</span>
              <p className="text-sm font-semibold">1,200 sqft</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">About this Property</h3>
            <p className="text-muted-foreground leading-relaxed">
              This stunning {property.title.toLowerCase()} located in the heart of {property.address} offers 
              unparalleled luxury and convenience. Featuring modern finishes, spacious rooms, and 
              premium accessibility. The property has been fully vetted by our field agents 
              and is currently 100% vacant and ready for immediate occupation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">V</div>
                <div>
                   <p className="font-bold">Verified Agent</p>
                   <p className="text-xs text-muted-foreground">Joined March 2024</p>
                </div>
             </div>
             <Button variant="outline" className="w-full rounded-xl bg-white dark:bg-slate-900">Message Agent</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
