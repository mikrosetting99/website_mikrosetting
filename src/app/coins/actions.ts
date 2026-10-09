"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createCoinPackagePayment } from "@/lib/services/payment.service";
import { subscribeToPlan } from "@/lib/services/subscription.service";

export interface BuyCoinResult {
  ok: boolean;
  message: string;
}

export async function buyCoinPackageAction(coinPackageId: string): Promise<BuyCoinResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Silakan login terlebih dahulu." };
  }

  try {
    const result = await createCoinPackagePayment(session.user.id, coinPackageId);
    revalidatePath("/coins");
    revalidatePath("/");
    if (!result.success) {
      return { ok: false, message: "Pembayaran gagal, silakan coba lagi." };
    }
    return { ok: true, message: "Koin berhasil ditambahkan ke saldo Anda." };
  } catch (error) {
    console.error("buyCoinPackageAction failed", error);
    return { ok: false, message: "Terjadi kesalahan saat memproses pembayaran." };
  }
}

export async function subscribeToPlanAction(planId: string): Promise<BuyCoinResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Silakan login terlebih dahulu." };
  }

  try {
    await subscribeToPlan(session.user.id, planId);
    revalidatePath("/coins");
    return { ok: true, message: "Subscription berhasil diaktifkan." };
  } catch (error) {
    console.error("subscribeToPlanAction failed", error);
    return { ok: false, message: "Terjadi kesalahan saat memproses subscription." };
  }
}
