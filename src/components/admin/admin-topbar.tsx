import Link from "next/link";
import { Bell, Coins, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/layout/user-menu";
import { SiteLogo } from "@/components/layout/site-logo";

interface AdminTopBarProps {
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" };
  coinBalance: number;
  siteName: string;
  logoUrl?: string;
}

export function AdminTopBar({ user, coinBalance, siteName, logoUrl }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 sm:px-6">
      <Link href="/admin" className="flex shrink-0 items-center gap-2">
        <SiteLogo siteName={siteName} logoUrl={logoUrl} hideNameOnMobile />
        <span className="hidden rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 sm:inline">
          Admin Panel
        </span>
      </Link>

      <div className="relative hidden max-w-xl flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari pengguna, tool, transaksi, atau data lainnya..." className="border-0 bg-slate-800 pl-9 text-slate-100 placeholder:text-slate-400" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 sm:flex">
          <Coins className="h-4 w-4" />
          {coinBalance.toLocaleString("id-ID")} Koin
        </div>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 sm:flex"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
