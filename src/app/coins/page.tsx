import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Coins } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getCoinBalance } from "@/lib/services/coin.service";
import { getActiveSubscription } from "@/lib/services/subscription.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyCoinButton } from "@/components/coins/buy-coin-button";
import { SubscribeButton } from "@/components/coins/subscribe-button";

export default async function CoinsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [coinPackages, subscriptionPlans, coinBalance, activeSubscription] = await Promise.all([
    prisma.coinPackage.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { price: "asc" } }),
    getCoinBalance(session.user.id),
    getActiveSubscription(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mb-6 flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
        <Coins className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">Saldo Anda saat ini:</span>
        <span className="font-semibold">{coinBalance} Koin</span>
      </div>

      <h1 className="mb-3 text-lg font-semibold">Beli Koin</h1>
      {coinPackages.length === 0 ? (
        <p className="mb-6 text-sm text-muted-foreground">Belum ada paket koin tersedia.</p>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {coinPackages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{pkg.coinAmount} Koin</CardTitle>
                {pkg.bonusCoin > 0 && (
                  <p className="text-xs text-emerald-600">+{pkg.bonusCoin} bonus</p>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  Rp{pkg.price.toLocaleString("id-ID")}
                </p>
                <BuyCoinButton coinPackageId={pkg.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Paket Subscriber</h2>
      {activeSubscription && (
        <p className="mb-3 text-sm text-muted-foreground">
          Subscription aktif: <span className="font-medium text-foreground">{activeSubscription.plan.name}</span>{" "}
          hingga {activeSubscription.endDate.toLocaleDateString("id-ID")}
        </p>
      )}
      {subscriptionPlans.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada paket subscriber tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{plan.durationDays} hari</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm font-medium">Rp{plan.price.toLocaleString("id-ID")}</p>
                <SubscribeButton planId={plan.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
