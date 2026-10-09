import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const usages = await prisma.toolUsage.findMany({
    where: { userId: session.user.id },
    include: { tool: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      <h1 className="mb-4 text-xl font-semibold">Riwayat Tool</h1>

      {usages.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Belum ada riwayat penggunaan tool.</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {usages.map((usage) => (
            <li key={usage.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{usage.tool.name}</p>
                <p className="text-xs text-muted-foreground">
                  {usage.createdAt.toLocaleString("id-ID")}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {usage.coinSpent > 0 ? `${usage.coinSpent} Koin` : "FREE"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
