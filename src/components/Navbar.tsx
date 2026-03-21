"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "./ui/Button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform">
            V
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground underline decoration-primary/30 underline-offset-4 decoration-4">
            VacantSpot
          </span>
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background animate-in slide-in-from-top duration-300 border-b border-border">
          <div className="flex flex-col p-6 gap-6 font-medium">
            <Link href="/" className="hover:text-primary transition-colors py-2" onClick={toggleMenu}>Home</Link>
            
            {user?.role === "AGENT" && (
              <Link href="/dashboard" className="hover:text-primary transition-colors py-2" onClick={toggleMenu}>Agent Dashboard</Link>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link href="/dashboard" className="hover:text-primary transition-colors py-2" onClick={toggleMenu}>Manage Listings</Link>
                <Link href="/admin" className="hover:text-primary transition-colors py-2" onClick={toggleMenu}>Admin Queue</Link>
              </>
            )}

            <div className="pt-6 border-t border-border mt-2">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-primary tracking-widest">{user.role}</span>
                      <span className="text-lg font-bold">{user.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { logout(); toggleMenu(); }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl">
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/login" className="hover:text-primary transition-colors py-2 w-full text-center border border-border rounded-xl" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link href="/signup" onClick={toggleMenu}>
                    <Button className="w-full rounded-xl shadow-md h-12 text-base">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
