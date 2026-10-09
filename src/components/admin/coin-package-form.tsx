"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CoinPackageFormState } from "@/app/admin/coin-packages/actions";
import type { CoinPackage } from "@/generated/prisma/client";

interface CoinPackageFormProps {
  coinPackage?: CoinPackage;
  action: (prevState: CoinPackageFormState, formData: FormData) => Promise<CoinPackageFormState>;
  submitLabel: string;
}

export function CoinPackageForm({ coinPackage, action, submitLabel }: CoinPackageFormProps) {
  const [state, formAction, isPending] = useActionState<CoinPackageFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama Paket</Label>
        <Input id="name" name="name" defaultValue={coinPackage?.name} placeholder="100 Koin" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coinAmount">Jumlah Koin</Label>
          <Input id="coinAmount" name="coinAmount" type="number" min={1} defaultValue={coinPackage?.coinAmount} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bonusCoin">Bonus Koin</Label>
          <Input id="bonusCoin" name="bonusCoin" type="number" min={0} defaultValue={coinPackage?.bonusCoin ?? 0} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Harga (Rp)</Label>
        <Input id="price" name="price" type="number" min={0} defaultValue={coinPackage?.price} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sortOrder">Urutan</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={coinPackage?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={coinPackage?.isActive ?? true} />
        Aktif
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
