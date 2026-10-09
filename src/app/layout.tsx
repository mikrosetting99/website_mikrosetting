import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This app is entirely session/DB-driven (coin balances, catalog, admin
// data) — nothing here is safe to statically prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mikrosetting — Katalog Tools Jaringan",
  description:
    "Katalog tools, script, template, dan layanan jaringan: MikroTik, Hotspot, OLT, VPN, Website, dan lainnya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
