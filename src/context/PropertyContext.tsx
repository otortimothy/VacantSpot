"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Property } from "@/components/ui/PropertyCard";

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id" | "isVerified">) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage or MOCK_PROPERTIES
  useEffect(() => {
    const savedProperties = localStorage.getItem("vacantspot_properties");
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    } else {
      setProperties(MOCK_PROPERTIES);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever properties change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vacantspot_properties", JSON.stringify(properties));
    }
  }, [properties, isInitialized]);

  const addProperty = (newProp: Omit<Property, "id" | "isVerified">) => {
    const property: Property = {
      ...newProp,
      id: `prop-${Math.random().toString(36).substr(2, 9)}`,
      isVerified: false, // New listings start as unverified
    };
    setProperties((prev) => [property, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const getPropertyById = (id: string) => {
    return properties.find((p) => p.id === id);
  };

  return (
    <PropertyContext.Provider
      value={{ properties, addProperty, updateProperty, deleteProperty, getPropertyById }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
};
