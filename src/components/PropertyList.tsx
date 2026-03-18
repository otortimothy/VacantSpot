"use client";

import React, { useState, useMemo } from "react";
import PropertyCard, { Property } from "./ui/PropertyCard";
import Button from "./ui/Button";

interface PropertyListProps {
  initialProperties: Property[];
}

const CATEGORIES = ["All", "Apartment", "Studio", "Duplex", "Bungalow"];

const PropertyList = ({ initialProperties }: PropertyListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           property.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || property.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProperties, searchQuery, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Search Bar (Re-implemented here for interactivity or moved from page.tsx) */}
      <div className="max-w-2xl mx-auto p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border -mt-20 relative z-20 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by neighborhood or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-12 pr-4 py-4 rounded-xl focus:outline-none text-foreground font-medium"
          />
        </div>
        <Button size="lg" className="rounded-xl px-10">Search</Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
              selectedCategory === category 
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                : "bg-white dark:bg-slate-900 border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              {searchQuery || selectedCategory !== "All" ? `Results (${filteredProperties.length})` : "Featured Properties"}
            </h2>
            <p className="text-muted-foreground">Handpicked verified listings across Abuja.</p>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-border transition-all">
            <div className="text-6xl text-muted-foreground/20 font-black tracking-tighter uppercase">No Spots Found</div>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            <Button variant="outline" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>Clear All Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PropertyList;
