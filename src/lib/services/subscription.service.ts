import { prisma } from "@/lib/db/prisma";

export async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gte: new Date() },
    },
  });
  return !!subscription;
}

export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gte: new Date() } },
    include: { plan: true },
    orderBy: { endDate: "desc" },
  });
}

export async function subscribeToPlan(userId: string, planId: string) {
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new Error("Paket subscription tidak ditemukan atau tidak aktif.");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  return prisma.subscription.create({
    data: {
      userId,
      planId,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });
}
