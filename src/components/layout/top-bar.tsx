"use client";

import Link from "next/link";
import { Coins, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { SiteLogo } from "@/components/layout/site-logo";
import { NotificationBell } from "@/components/layout/notification-bell";
import type { Notification } from "@/generated/prisma/client";

interface TopBarProps {
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" } | null;
  coinBalance: number;
  siteName: string;
  logoUrl?: string;
  notifications: Notification[];
}

export function TopBar({ user, coinBalance, siteName, logoUrl, notifications }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <SiteLogo siteName={siteName} logoUrl={logoUrl} />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-full border bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 sm:flex">
                <Coins className="h-4 w-4" />
                {coinBalance} Koin
              </div>
              <div className="hidden sm:flex">
                <NotificationBell notifications={notifications} />
              </div>
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
    </header>
  );
}
