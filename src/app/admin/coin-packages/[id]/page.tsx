import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { CoinPackageForm } from "@/components/admin/coin-package-form";
import { updateCoinPackageAction } from "@/app/admin/coin-packages/actions";

export default async function EditCoinPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coinPackage = await prisma.coinPackage.findUnique({ where: { id } });
  if (!coinPackage) notFound();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit Paket Koin</h1>
      <CoinPackageForm
        coinPackage={coinPackage}
        action={updateCoinPackageAction.bind(null, coinPackage.id)}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
