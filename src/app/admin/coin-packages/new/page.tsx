import { CoinPackageForm } from "@/components/admin/coin-package-form";
import { createCoinPackageAction } from "@/app/admin/coin-packages/actions";

export default function NewCoinPackagePage() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Tambah Paket Koin</h1>
      <CoinPackageForm action={createCoinPackageAction} submitLabel="Simpan Paket" />
    </div>
  );
}
