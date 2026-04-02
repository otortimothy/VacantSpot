import React from "react";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  isVerified?: boolean;
  verifiedAt?: string | null;
}

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className = "" }: PropertyCardProps) => {
  return (
    <div className={`bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card ${className}`}>
      <div className="relative h-52 w-full bg-muted overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover/card:scale-110 transition-transform duration-500"
        />
        {/* Verified badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 z-10">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
        {/* Featured tag */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
          {property.type}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold line-clamp-1 group-hover/card:text-primary transition-colors">{property.title}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <svg className="w-3 h-3 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-y border-border py-2.5">
          <span className="flex items-center gap-1">🛏️ {property.bedrooms} Beds</span>
          <span className="flex items-center gap-1">🚿 {property.bathrooms} Baths</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-black text-primary">
              ₦{property.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">per year</p>
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold border-primary/30 hover:border-primary hover:bg-primary/5">
              View Details →
            </Button>
          </Link>
        </div>

        {property.verifiedAt && (
          <p className="text-[10px] text-green-600 dark:text-green-500 font-medium border-t border-border pt-2">
            🛡️ Verified by VacantSpot on {new Date(property.verifiedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
