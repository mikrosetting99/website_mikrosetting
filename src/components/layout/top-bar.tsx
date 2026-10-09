"use client";

import Link from "next/link";
import { Bell, Coins, LogIn, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";

interface TopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" } | null;
  coinBalance: number;
}

export function TopBar({ query, onQueryChange, user, coinBalance }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 text-lg font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            M
          </span>
          <span>
            MIKRO<span className="text-primary">SETTING</span>
          </span>
        </Link>

        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cari tool, template, atau script..."
            className="pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-full border bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 sm:flex">
                <Coins className="h-4 w-4" />
                {coinBalance} Koin
              </div>
              <button
                type="button"
                className="hidden h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-accent sm:flex"
                aria-label="Notifikasi"
              >
                <Bell className="h-4 w-4" />
              </button>
              <UserMenu user={user} />
            </>
          ) : (
            <Button size="sm" render={<Link href="/login" />}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>

      <div className="relative px-4 pb-3 md:hidden">
        <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari tool, template, atau script..."
          className="pl-9"
        />
      </div>
    </header>
  );
}
