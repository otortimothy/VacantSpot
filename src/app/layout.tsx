import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VacantSpot | Verified Housing in Abuja",
  description: "Find verified, vacant houses in Abuja, Nigeria without the hassle of fake listings.",
};

import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  let userProfile = null;
  if (authUser) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (data) {
      userProfile = {
        id: authUser.id,
        name: data.name || "User",
        email: data.email,
        role: data.role,
        has_paid: data.has_paid,
        is_verified: data.is_verified,
      };
    }
  }

  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar user={userProfile} />
        {children}
      </body>
    </html>
  );
}
