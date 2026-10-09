"use server";

import { revalidatePath } from "next/cache";
import { adjustCoinBalance } from "@/lib/services/coin.service";

export interface AdjustCoinState {
  error?: string;
  success?: boolean;
}

export async function adjustUserCoinAction(
  userId: string,
  _prevState: AdjustCoinState,
  formData: FormData,
): Promise<AdjustCoinState> {
  const amount = Number(formData.get("amount"));
  const description = String(formData.get("description") ?? "").trim();

  if (!Number.isFinite(amount) || amount === 0) {
    return { error: "Jumlah koin tidak valid." };
  }

  try {
    await adjustCoinBalance(userId, amount, "ADMIN_ADJUSTMENT", description || "Penyesuaian oleh admin");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyesuaikan saldo." };
  }
}
