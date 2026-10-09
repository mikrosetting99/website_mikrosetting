import { Package, Users, Crown, Coins } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { StatCard } from "@/components/admin/stat-card";
import { AdminToolsPreview } from "@/components/admin/admin-tools-preview";
import { AdminCoinPackagesWidget } from "@/components/admin/admin-coin-packages-widget";
import { AdminRecentTransactionsWidget } from "@/components/admin/admin-recent-transactions-widget";

function computeTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const period30Start = new Date(now);
  period30Start.setDate(period30Start.getDate() - 30);
  const period60Start = new Date(now);
  period60Start.setDate(period60Start.getDate() - 60);

  const [
    totalTools,
    totalUsers,
    activeSubscribers,
    coinSoldAgg,
    toolsThisPeriod,
    toolsPrevPeriod,
    usersThisPeriod,
    usersPrevPeriod,
    subsThisPeriod,
    subsPrevPeriod,
    coinSoldThisPeriodAgg,
    coinSoldPrevPeriodAgg,
    tools,
    coinPackages,
    recentTransactions,
  ] = await Promise.all([
    prisma.tool.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", endDate: { gte: now } } }),
    prisma.coinTransaction.aggregate({ where: { type: "PURCHASE" }, _sum: { amount: true } }),
    prisma.tool.count({ where: { createdAt: { gte: period30Start } } }),
    prisma.tool.count({ where: { createdAt: { gte: period60Start, lt: period30Start } } }),
    prisma.user.count({ where: { createdAt: { gte: period30Start } } }),
    prisma.user.count({ where: { createdAt: { gte: period60Start, lt: period30Start } } }),
    prisma.subscription.count({ where: { createdAt: { gte: period30Start } } }),
    prisma.subscription.count({ where: { createdAt: { gte: period60Start, lt: period30Start } } }),
    prisma.coinTransaction.aggregate({
      where: { type: "PURCHASE", createdAt: { gte: period30Start } },
      _sum: { amount: true },
    }),
    prisma.coinTransaction.aggregate({
      where: { type: "PURCHASE", createdAt: { gte: period60Start, lt: period30Start } },
      _sum: { amount: true },
    }),
    prisma.tool.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 5,
    }),
    prisma.coinPackage.findMany({ orderBy: { sortOrder: "asc" }, take: 3 }),
    prisma.coinTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { user: true },
    }),
  ]);

  const coinSold = coinSoldAgg._sum.amount ?? 0;

  const stats = [
    {
      label: "Total Tools",
      value: totalTools.toLocaleString("id-ID"),
      icon: Package,
      iconClassName: "bg-blue-100 text-blue-600",
      trendPercent: computeTrend(toolsThisPeriod, toolsPrevPeriod),
    },
    {
      label: "User Aktif",
      value: totalUsers.toLocaleString("id-ID"),
      icon: Users,
      iconClassName: "bg-emerald-100 text-emerald-600",
      trendPercent: computeTrend(usersThisPeriod, usersPrevPeriod),
    },
    {
      label: "Subscriber",
      value: activeSubscribers.toLocaleString("id-ID"),
      icon: Crown,
      iconClassName: "bg-amber-100 text-amber-600",
      trendPercent: computeTrend(subsThisPeriod, subsPrevPeriod),
    },
    {
      label: "Koin Terjual",
      value: coinSold.toLocaleString("id-ID"),
      icon: Coins,
      iconClassName: "bg-violet-100 text-violet-600",
      trendPercent: computeTrend(
        coinSoldThisPeriodAgg._sum.amount ?? 0,
        coinSoldPrevPeriodAgg._sum.amount ?? 0,
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">Ringkasan data dan aktivitas sistem Mikrosetting.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <AdminToolsPreview tools={tools} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCoinPackagesWidget coinPackages={coinPackages} />
        <AdminRecentTransactionsWidget transactions={recentTransactions} />
      </div>
    </div>
  );
}
