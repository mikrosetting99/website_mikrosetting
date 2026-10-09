"use client";

import { Search, Router } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroBannerProps {
  query: string;
  onQueryChange: (value: string) => void;
  badge: string;
  title: string;
  subtitle: string;
}

export function HeroBanner({ query, onQueryChange, badge, title, subtitle }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-700 px-6 py-8 text-primary-foreground sm:px-10 sm:py-10">
      <div className="relative z-10 max-w-xl">
        {badge && (
          <p className="text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
            {badge}
          </p>
        )}
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-primary-foreground/85 sm:text-base">{subtitle}</p>

        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cari tool, misalnya: login page, script FUP, VPN..."
            className="border-0 bg-background pl-9 text-foreground shadow-sm"
          />
        </div>
      </div>

      <Router
        className="pointer-events-none absolute -right-6 -bottom-10 h-56 w-56 text-primary-foreground/10 sm:h-64 sm:w-64"
        strokeWidth={1}
      />
    </div>
  );
}
