import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCoinBalance } from "@/lib/services/coin.service";
import { getSettings } from "@/lib/services/settings.service";
import { AdminTopBar } from "@/components/admin/admin-topbar";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [coinBalance, settings] = await Promise.all([
    getCoinBalance(session.user.id),
    getSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AdminTopBar
        user={{ name: session.user.name ?? null, email: session.user.email ?? null, role: session.user.role }}
        coinBalance={coinBalance}
        siteName={settings.site_name}
        logoUrl={settings.logo_url || undefined}
      />

      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-slate-800 bg-slate-900 md:flex md:flex-col">
          <AdminSidebarNav />
        </aside>

        <main className="w-full min-w-0 flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
