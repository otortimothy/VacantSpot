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
  loading: boolean;
  login: (email: string, password?: string) => void;
  signup: (userData: Omit<User, "id">) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const savedUser = localStorage.getItem("vacantspot_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password?: string) => {
    let role: Role = "RENTER";
    let name = "Renter User";

    if (email === "admin@vacantspot.com" && password === "admin123") {
      role = "ADMIN";
      name = "Site Moderator";
    } else if (email.includes("agent")) {
      role = "AGENT";
      name = "Abuja Agent";
    }

    const newUser: User = {
      id: "mock-" + Math.random().toString(36).substr(2, 4),
      name: name,
      email: email,
      role: role,
    };
    setUser(newUser);
    localStorage.setItem("vacantspot_user", JSON.stringify(newUser));
  };

  const signup = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
    };
    setUser(newUser);
    localStorage.setItem("vacantspot_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vacantspot_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
