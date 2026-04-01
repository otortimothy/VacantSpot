import PropertyList from "@/components/PropertyList";
import { createClient } from "@/lib/supabase/server";

// Next.js config to revalidate this page or make it dynamic
export const revalidate = 0; // for MVP, always fetch fresh data 

export default async function Home() {
  const supabase = await createClient();
  
  
  // RLS will automatically filter out properties from unverified/unpaid landlords
  const { data: dbProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const properties = (dbProperties || []).map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    address: p.address,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    imageUrl: p.image_urls?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    isVerified: true, // Only verified properties are fetched due to RLS
  }));

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900/40">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Verified Listings Only
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Find your next <span className="text-primary">vacant spot</span> in Abuja.
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Skip the fake listings and outdated agents. Discover verified, 
              available homes in the heart of Nigeria's capital.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Property List */}
      <PropertyList initialProperties={properties} />

      {/* Trust Section */}
      <section className="bg-slate-50 dark:bg-slate-900 overflow-hidden py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight">Why Choose <span className="text-primary underline underline-offset-8">VacantSpot</span>?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Verified Listings</h3>
                    <p className="text-muted-foreground">Every property on our platform is physically verified by our team to combat fraud.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Real-time Availability</h3>
                    <p className="text-muted-foreground">We delist properties immediately they are taken, so you don't waste time on ghost houses.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-primary to-blue-400 transform rotate-3 scale-95 opacity-20 absolute inset-0"></div>
              <div className="glass aspect-square rounded-3xl p-8 flex items-center justify-center relative border border-white/20">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-black text-primary">0%</div>
                  <div className="text-2xl font-bold uppercase tracking-widest">Fake Listings</div>
                  <p className="text-muted-foreground max-w-[250px] mx-auto">Our promise to the residents of Abuja looking for a home.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
