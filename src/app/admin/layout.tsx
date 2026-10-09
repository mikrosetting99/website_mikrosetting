import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tools", label: "Produk / Tools", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/subscribers", label: "Subscriber", icon: Crown },
  { href: "/admin/coin-transactions", label: "Transaksi Koin", icon: Coins },
  { href: "/admin/coin-packages", label: "Paket Koin", icon: PackagePlus },
  { href: "/admin/tool-usage", label: "Riwayat Tool", icon: History },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
        <div className="border-b px-4 py-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke situs
          </Link>
          <p className="mt-2 text-lg font-bold text-primary">MIKROSETTING</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-background p-4 md:p-8">{children}</main>
    </div>
  );
}
