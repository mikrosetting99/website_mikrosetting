import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getCoinBalance } from "@/lib/services/coin.service";
import { hasActiveSubscription } from "@/lib/services/subscription.service";
import { AccessBadge } from "@/components/catalog/access-badge";
import { ToolContent } from "@/components/tools/tool-content";
import { CoinConfirmGate } from "@/components/tools/coin-confirm-gate";
import { LoginRequiredCard, SubscriberRequiredCard } from "@/components/tools/access-required-card";
import type { Tool } from "@/generated/prisma/client";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool || !tool.isActive) notFound();

  const session = await auth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{tool.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
        </div>
        <AccessBadge type={tool.accessType} />
      </div>

      <ToolAccess tool={tool} userId={session?.user?.id ?? null} />
    </div>
  );
}

async function ToolAccess({ tool, userId }: { tool: Tool; userId: string | null }) {
  if (tool.accessType === "FREE") {
    return <ToolContent slug={tool.slug} name={tool.name} />;
  }

  if (tool.accessType === "SUBSCRIBER") {
    if (!userId) return <LoginRequiredCard />;
    const active = await hasActiveSubscription(userId);
    if (!active) return <SubscriberRequiredCard />;
    return <ToolContent slug={tool.slug} name={tool.name} />;
  }

  // COIN
  if (!userId) return <LoginRequiredCard />;
  const coinBalance = await getCoinBalance(userId);
  return (
    <CoinConfirmGate
      toolSlug={tool.slug}
      toolName={tool.name}
      coinCost={tool.coinCost}
      coinBalance={coinBalance}
    />
  );
}
