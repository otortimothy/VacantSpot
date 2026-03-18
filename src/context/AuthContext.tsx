"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "RENTER" | "AGENT" | "ADMIN" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    if (!role) {
      setUser(null);
      return;
    }
    setUser({
      id: "mock-1",
      name: role === "AGENT" ? "Abuja Agent" : role === "ADMIN" ? "Site Moderator" : "Renter User",
      email: "mock@example.com",
      role: role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
