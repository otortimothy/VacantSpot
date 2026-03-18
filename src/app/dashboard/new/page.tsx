import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function NewListing() {
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
          <h1 className="text-4xl font-bold tracking-tight">List a New Property</h1>
          <p className="text-muted-foreground text-lg">Provide accurate details for our field verification team.</p>
        </div>

        <form className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[32px] border border-border shadow-xl">
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Property Title" placeholder="e.g. Luxury 2 Bedroom Apartment" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 ml-1">Property Type</label>
                <select className="w-full px-4 py-2 rounded-lg border border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>Apartment</option>
                  <option>Studio</option>
                  <option>Duplex</option>
                  <option>Bungalow</option>
                </select>
              </div>
            </div>
            <Input label="Full Address" placeholder="e.g. Plot 123, Maitama Extension, Abuja" />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Pricing & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Annual Rent (₦)" type="number" placeholder="4,500,000" />
              <Input label="Bedrooms" type="number" placeholder="2" />
              <Input label="Bathrooms" type="number" placeholder="2" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Media</h3>
            <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <div>
                  <p className="font-bold">Upload Property Photos</p>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row gap-4">
            <Button size="lg" className="flex-1 rounded-xl h-14 text-lg">Submit for Verification</Button>
            <Button variant="outline" size="lg" className="rounded-xl h-14">Save Draft</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
