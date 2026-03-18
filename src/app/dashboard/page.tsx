import { MOCK_PROPERTIES } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  // Mock data for agent's own properties
  const myProperties = MOCK_PROPERTIES.slice(0, 2);

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-bold tracking-tight">Agent Dashboard</h1>
           <p className="text-muted-foreground text-lg">Manage your verified property listings in Abuja.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl space-y-4">
              <p className="text-primary-foreground/80 font-medium uppercase tracking-widest text-xs">Total Revenue (Annual)</p>
              <h3 className="text-4xl font-black">₦5.7M</h3>
              <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-3 py-1 rounded-full w-fit">
                 <span className="text-green-300">↑ 12%</span> vs last month
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
              <h4 className="font-bold text-lg">Quick Stats</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Listings</span>
                    <span className="font-bold">2</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending Verification</span>
                    <span className="font-bold text-amber-500">1</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-bold underline decoration-primary decoration-2 underline-offset-4">1,420</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Listings Table/List */}
        <div className="lg:col-span-2 space-y-6">
           <h4 className="text-xl font-bold">Your Listings</h4>
           <div className="space-y-4">
              {myProperties.map((property) => (
                <div key={property.id} className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border hover:border-primary/50 transition-all flex gap-4 md:items-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={property.imageUrl}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold truncate text-lg group-hover:text-primary transition-colors">{property.title}</h5>
                    <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                    <div className="mt-2 flex items-center gap-3">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${property.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {property.isVerified ? 'Verified' : 'Pending'}
                       </span>
                       <span className="text-sm font-bold text-primary">₦{property.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg">Edit</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">Delete</Button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
