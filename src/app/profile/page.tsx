import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { getCoinBalance } from "@/lib/services/coin.service";
import { getActiveSubscription } from "@/lib/services/subscription.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/(auth)/actions";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [coinBalance, activeSubscription] = await Promise.all([
    getCoinBalance(session.user.id),
    getActiveSubscription(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      <h1 className="mb-4 text-xl font-semibold">Profil</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{session.user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo Koin</span>
            <span className="font-medium">{coinBalance} Koin</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subscriber</span>
            <span className="font-medium">
              {activeSubscription
                ? `Aktif hingga ${activeSubscription.endDate.toLocaleDateString("id-ID")}`
                : "Tidak aktif"}
            </span>
          </div>
        </CardContent>
      </Card>

      <form action={signOutAction}>
        <Button type="submit" variant="outline" className="w-full">
          Keluar
        </Button>
      </form>
    </div>
  );
}
