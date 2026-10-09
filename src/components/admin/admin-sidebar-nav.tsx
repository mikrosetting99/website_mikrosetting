"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Crown,
  Coins,
  PackagePlus,
  History,
  Settings,
  Bell,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tools", label: "Produk / Tools", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/subscribers", label: "Subscriber", icon: Crown },
  { href: "/admin/coin-transactions", label: "Transaksi Koin", icon: Coins },
  { href: "/admin/coin-packages", label: "Paket Koin", icon: PackagePlus },
  { href: "/admin/tool-usage", label: "Riwayat Tool", icon: History },
  { href: "/admin/notifications", label: "Notifikasi", icon: Bell },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 p-3">
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}

      <div className="my-2 border-t border-slate-800" />

      <Link
        href="/admin/settings"
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          pathname.startsWith("/admin/settings")
            ? "bg-primary text-primary-foreground"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
        )}
      >
        <Settings className="h-4 w-4" />
        Pengaturan
      </Link>
    </nav>
  );
}
