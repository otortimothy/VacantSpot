"use client";

import React from "react";
import Link from "next/link";
import Button from "./ui/Button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform">
            V
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground underline decoration-primary/30 underline-offset-4 decoration-4">
            VacantSpot
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          
          {user?.role === "AGENT" && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">Agent Dashboard</Link>
          )}

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-primary transition-colors">Admin Queue</Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold bg-muted px-2 py-1 rounded-full uppercase tracking-widest">{user.role}</span>
               <button onClick={logout} className="hover:text-red-500 transition-colors text-sm">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}

          {/* Test State Switcher */}
          <select 
            className="text-[10px] bg-muted border border-border rounded px-1"
            onChange={(e) => login(e.target.value as any)}
            value={user?.role || ""}
          >
            <option value="">Visitor</option>
            <option value="AGENT">Agent</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="md:hidden p-2 text-muted-foreground">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
