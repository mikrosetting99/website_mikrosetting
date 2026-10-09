"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { coinPackageSchema } from "@/lib/validators/coin-package";

export interface CoinPackageFormState {
  error?: string;
}

function parseForm(formData: FormData) {
  return coinPackageSchema.safeParse({
    name: formData.get("name"),
    coinAmount: formData.get("coinAmount"),
    price: formData.get("price"),
    bonusCoin: formData.get("bonusCoin") || 0,
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function createCoinPackageAction(
  _prevState: CoinPackageFormState,
  formData: FormData,
): Promise<CoinPackageFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }
  await prisma.coinPackage.create({ data: parsed.data });
  revalidatePath("/admin/coin-packages");
  revalidatePath("/coins");
  redirect("/admin/coin-packages");
}

export async function updateCoinPackageAction(
  id: string,
  _prevState: CoinPackageFormState,
  formData: FormData,
): Promise<CoinPackageFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }
  await prisma.coinPackage.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/coin-packages");
  revalidatePath("/coins");
  redirect("/admin/coin-packages");
}

export async function deleteCoinPackageAction(id: string) {
  await prisma.coinPackage.delete({ where: { id } });
  revalidatePath("/admin/coin-packages");
  revalidatePath("/coins");
}
