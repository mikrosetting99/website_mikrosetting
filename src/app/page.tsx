import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getCoinBalance } from "@/lib/services/coin.service";
import { getSettings } from "@/lib/services/settings.service";
import { CatalogShell } from "@/components/catalog/catalog-shell";

export default async function HomePage() {
  const session = await auth();

  const [categories, tools, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.tool.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { category: true },
    }),
    getSettings(),
  ]);

  const coinBalance = session?.user ? await getCoinBalance(session.user.id) : 0;

  return (
    <CatalogShell
      categories={categories}
      tools={tools}
      user={
        session?.user
          ? { name: session.user.name ?? null, email: session.user.email ?? null, role: session.user.role }
          : null
      }
      coinBalance={coinBalance}
      siteName={settings.site_name}
      logoUrl={settings.logo_url || undefined}
      heroBadge={settings.hero_badge}
      heroTitle={settings.hero_title}
      heroSubtitle={settings.hero_subtitle}
    />
  );
}
