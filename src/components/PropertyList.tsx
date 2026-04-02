"use client";

import React, { useState, useMemo } from "react";
import PropertyCard, { Property } from "./ui/PropertyCard";
import Button from "./ui/Button";

interface PropertyListProps {
  initialProperties: Property[];
}

const CATEGORIES = ["All", "Apartment", "Studio", "Duplex", "Bungalow"];

const ABUJA_DISTRICTS = [
  "All Areas",
  "Maitama",
  "Wuse",
  "Wuse II",
  "Garki",
  "Asokoro",
  "Gwarinpa",
  "Jabi",
  "Utako",
  "Kubwa",
  "Lugbe",
  "Kado",
  "Lifecamp",
  "Lokogoma",
];

const PropertyList = ({ initialProperties }: PropertyListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All Areas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("0");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || property.type === selectedCategory;

      const matchesDistrict =
        selectedDistrict === "All Areas" ||
        property.address.toLowerCase().includes(selectedDistrict.toLowerCase());

      const matchesMinPrice =
        !minPrice || property.price >= Number(minPrice);

      const matchesMaxPrice =
        !maxPrice || property.price <= Number(maxPrice);

      const matchesBedrooms =
        minBedrooms === "0" || property.bedrooms >= Number(minBedrooms);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDistrict &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms
      );
    });
  }, [initialProperties, searchQuery, selectedCategory, selectedDistrict, minPrice, maxPrice, minBedrooms]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedDistrict !== "All Areas" ||
    minPrice ||
    maxPrice ||
    minBedrooms !== "0";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDistrict("All Areas");
    setMinPrice("");
    setMaxPrice("");
    setMinBedrooms("0");
  };

  return (
    <div className="space-y-10">
      {/* Search + Filter Bar */}
      <div className="max-w-3xl mx-auto -mt-20 relative z-20 space-y-3 px-4">
        <div className="flex gap-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border">
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${showFilters || hasActiveFilters ? "bg-primary text-white" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full" />}
          </button>
          <Button size="lg" className="rounded-xl px-8 hidden sm:block">Search</Button>
        </div>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-lg p-5 space-y-5 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Location</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {ABUJA_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Min Bedrooms */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Min Bedrooms</label>
                <select
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price Range (₦/yr)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="text-muted-foreground text-sm shrink-0">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Pills */}
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">
              {hasActiveFilters ? `${filteredProperties.length} Result${filteredProperties.length !== 1 ? "s" : ""}` : "Featured Properties"}
            </h2>
            <p className="text-muted-foreground">Every listing is physically verified by the VacantSpot team.</p>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-primary font-bold flex items-center gap-1 transition-colors">
              Clear filters ×
            </button>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-border transition-all">
            <div className="text-6xl text-muted-foreground/20 font-black tracking-tighter uppercase">No Spots Found</div>
            <p className="text-muted-foreground">Try adjusting your filters or expand your search area.</p>
            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PropertyList;
