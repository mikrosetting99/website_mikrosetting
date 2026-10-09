import Link from "next/link";
import { Bell, Coins, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/layout/user-menu";

interface AdminTopBarProps {
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" };
  coinBalance: number;
}

export function AdminTopBar({ user, coinBalance }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background px-4 py-3 sm:px-6">
      <Link href="/admin" className="flex shrink-0 items-center gap-1.5 text-lg font-bold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          M
        </span>
        <span className="hidden sm:inline">
          MIKRO<span className="text-primary">SETTING</span>
        </span>
      </Link>

      <div className="relative hidden max-w-xl flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari pengguna, tool, transaksi, atau data lainnya..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 sm:flex">
          <Coins className="h-4 w-4" />
          {coinBalance.toLocaleString("id-ID")} Koin
        </div>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-accent sm:flex"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
