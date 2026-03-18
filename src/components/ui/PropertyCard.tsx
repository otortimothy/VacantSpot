import React from "react";
import Image from "next/image";
import Button from "./Button";

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  isVerified: boolean;
}

import Link from "next/link";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className = "" }: PropertyCardProps) => {
  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group/card ${className}`}>
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover/card:scale-110 transition-transform duration-500"
        />
        {property.isVerified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-10 transition-transform active:scale-95 cursor-default">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1 group-hover/card:text-primary transition-colors">{property.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-y border-border py-2">
          <span className="flex items-center gap-1">
             🛏️ {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
             🚿 {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
             🏠 {property.type}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xl font-bold text-primary">
            ₦{property.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">/yr</span>
          </p>
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="sm" className="rounded-lg">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
