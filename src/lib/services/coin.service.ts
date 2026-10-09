import { prisma } from "@/lib/db/prisma";
import type { CoinTransactionType, Prisma } from "@/generated/prisma/client";
import { InsufficientCoinError, ToolNotFoundError } from "./errors";

export async function getCoinBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coinBalance: true },
  });
  return user?.coinBalance ?? 0;
}

/**
 * Atomically spends `cost` coins for a tool usage.
 *
 * The balance check + decrement happens in a single conditional UPDATE
 * (`WHERE coinBalance >= cost`), which Postgres evaluates atomically at the
 * row level. This makes the operation safe under concurrent requests
 * without needing an explicit SELECT ... FOR UPDATE lock: two simultaneous
 * spends can never both succeed if the balance only covers one of them.
 */
export async function spendCoinsForTool(userId: string, toolId: string) {
  return prisma.$transaction(async (tx) => {
    const tool = await tx.tool.findUnique({ where: { id: toolId } });
    if (!tool || !tool.isActive) {
      throw new ToolNotFoundError();
    }

    const cost = tool.accessType === "COIN" ? tool.coinCost : 0;

    if (cost > 0) {
      const updateResult = await tx.user.updateMany({
        where: { id: userId, coinBalance: { gte: cost } },
        data: { coinBalance: { decrement: cost } },
      });

      if (updateResult.count === 0) {
        const current = await tx.user.findUniqueOrThrow({
          where: { id: userId },
          select: { coinBalance: true },
        });
        throw new InsufficientCoinError(cost, current.coinBalance);
      }
    }

    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { coinBalance: true },
    });
    const balanceAfter = user.coinBalance;
    const balanceBefore = balanceAfter + cost;

    if (cost > 0) {
      await tx.coinTransaction.create({
        data: {
          userId,
          type: "TOOL_USAGE",
          amount: -cost,
          balanceBefore,
          balanceAfter,
          toolId,
          description: `Penggunaan tool: ${tool.name}`,
        },
      });
    }

    await tx.toolUsage.create({
      data: { userId, toolId, coinSpent: cost },
    });

    return { tool, coinSpent: cost, balanceAfter };
  });
}

/**
 * Adjusts a user's coin balance (purchase, bonus, admin adjustment, refund)
 * and records it in coin_transactions. Pass `tx` to run as part of an
 * already-open transaction (e.g. after confirming a payment).
 */
export async function adjustCoinBalance(
  userId: string,
  amount: number,
  type: CoinTransactionType,
  description?: string,
  tx?: Prisma.TransactionClient,
) {
  const exec = async (client: Prisma.TransactionClient) => {
    if (amount < 0) {
      const updateResult = await client.user.updateMany({
        where: { id: userId, coinBalance: { gte: -amount } },
        data: { coinBalance: { increment: amount } },
      });
      if (updateResult.count === 0) {
        const current = await client.user.findUniqueOrThrow({
          where: { id: userId },
          select: { coinBalance: true },
        });
        throw new InsufficientCoinError(-amount, current.coinBalance);
      }
    } else {
      await client.user.update({
        where: { id: userId },
        data: { coinBalance: { increment: amount } },
      });
    }

    const user = await client.user.findUniqueOrThrow({
      where: { id: userId },
      select: { coinBalance: true },
    });
    const balanceAfter = user.coinBalance;
    const balanceBefore = balanceAfter - amount;

    return client.coinTransaction.create({
      data: {
        userId,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        description,
      },
    });
  };

  if (tx) return exec(tx);
  return prisma.$transaction((client) => exec(client));
}
