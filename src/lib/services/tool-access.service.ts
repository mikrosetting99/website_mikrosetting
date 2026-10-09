import { prisma } from "@/lib/db/prisma";
import { spendCoinsForTool } from "./coin.service";
import { hasActiveSubscription } from "./subscription.service";
import {
  SubscriptionRequiredError,
  ToolNotFoundError,
  UnauthorizedError,
} from "./errors";

/**
 * Backend-enforced gate for opening a tool. Never trust the frontend for
 * access decisions — this is the single source of truth, called from the
 * server action / route handler behind "Buka Tool" / "Gunakan Koin".
 */
export async function accessTool(userId: string | null, toolSlug: string) {
  const tool = await prisma.tool.findUnique({ where: { slug: toolSlug } });
  if (!tool || !tool.isActive) {
    throw new ToolNotFoundError();
  }

  if (tool.accessType === "FREE") {
    return { tool, coinSpent: 0 };
  }

  if (!userId) {
    throw new UnauthorizedError();
  }

  if (tool.accessType === "SUBSCRIBER") {
    const isSubscriber = await hasActiveSubscription(userId);
    if (!isSubscriber) {
      throw new SubscriptionRequiredError();
    }
    return { tool, coinSpent: 0 };
  }

  // accessType === "COIN"
  const result = await spendCoinsForTool(userId, tool.id);
  return { tool: result.tool, coinSpent: result.coinSpent, balanceAfter: result.balanceAfter };
}
