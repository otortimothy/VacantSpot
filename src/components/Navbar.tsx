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
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Manage Listings</Link>
              <Link href="/admin" className="hover:text-primary transition-colors">Admin Queue</Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-border">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-black text-primary tracking-widest">{user.role}</span>
                <span className="text-sm font-bold truncate max-w-[120px]">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-xl shadow-md">Get Started</Button>
              </Link>
            </div>
          )}
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
