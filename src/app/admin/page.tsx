import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalTools,
    totalUsers,
    activeSubscribers,
    coinSoldAgg,
    usageToday,
    recentTransactions,
    recentUsages,
  ] = await Promise.all([
    prisma.tool.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", endDate: { gte: new Date() } } }),
    prisma.coinTransaction.aggregate({
      where: { type: "PURCHASE" },
      _sum: { amount: true },
    }),
    prisma.toolUsage.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.coinTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
    prisma.toolUsage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true, tool: true },
    }),
  ]);

  const stats = [
    { label: "Total Tools", value: totalTools },
    { label: "Total Users", value: totalUsers },
    { label: "Subscriber Aktif", value: activeSubscribers },
    { label: "Koin Terjual", value: coinSoldAgg._sum.amount ?? 0 },
    { label: "Penggunaan Tool Hari Ini", value: usageToday },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-normal text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stat.value.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaksi Koin Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {recentTransactions.length === 0 && (
              <p className="text-muted-foreground">Belum ada transaksi.</p>
            )}
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{tx.user.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.type}</p>
                </div>
                <span className={tx.amount < 0 ? "text-destructive" : "text-emerald-600"}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Penggunaan Tool Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {recentUsages.length === 0 && (
              <p className="text-muted-foreground">Belum ada penggunaan tool.</p>
            )}
            {recentUsages.map((usage) => (
              <div key={usage.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{usage.tool.name}</p>
                  <p className="text-xs text-muted-foreground">{usage.user.name}</p>
                </div>
                <span>{usage.coinSpent > 0 ? `${usage.coinSpent} Koin` : "FREE"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
