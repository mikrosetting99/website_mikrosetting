import { prisma } from "@/lib/db/prisma";
import { adjustCoinBalance } from "./coin.service";

export interface ChargeResult {
  success: boolean;
  providerRef?: string;
}

/**
 * Payment provider abstraction. Swap `defaultPaymentProvider` for a real
 * gateway (Midtrans, Xendit, etc.) later without touching callers —
 * they only depend on this interface.
 */
export interface PaymentProvider {
  charge(payment: { id: string; amount: number }): Promise<ChargeResult>;
}

/**
 * Dummy provider used until a real payment gateway is integrated.
 * Immediately approves the charge so coin purchases are testable end to
 * end with seed/dev data.
 */
export class DummyPaymentProvider implements PaymentProvider {
  async charge(payment: { id: string }): Promise<ChargeResult> {
    return { success: true, providerRef: `DUMMY-${payment.id}` };
  }
}

export const defaultPaymentProvider: PaymentProvider = new DummyPaymentProvider();

export async function createCoinPackagePayment(
  userId: string,
  coinPackageId: string,
  provider: PaymentProvider = defaultPaymentProvider,
) {
  const coinPackage = await prisma.coinPackage.findUnique({ where: { id: coinPackageId } });
  if (!coinPackage || !coinPackage.isActive) {
    throw new Error("Paket koin tidak ditemukan atau tidak aktif.");
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      coinPackageId,
      amount: coinPackage.price,
      status: "PENDING",
    },
  });

  const result = await provider.charge({ id: payment.id, amount: payment.amount });

  if (!result.success) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return { payment, success: false };
  }

  return confirmCoinPackagePayment(payment.id, result.providerRef);
}

export async function confirmCoinPackagePayment(paymentId: string, providerRef?: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: { coinPackage: true },
    });

    if (payment.status === "PAID") {
      return { payment, success: true };
    }

    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", providerRef },
    });

    const totalCoin = payment.coinPackage.coinAmount + payment.coinPackage.bonusCoin;

    await adjustCoinBalance(
      payment.userId,
      totalCoin,
      "PURCHASE",
      `Pembelian paket koin: ${payment.coinPackage.name}`,
      tx,
    );

    return { payment: updatedPayment, success: true };
  });
}
