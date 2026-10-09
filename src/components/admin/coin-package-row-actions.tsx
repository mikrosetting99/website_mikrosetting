"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteCoinPackageAction } from "@/app/admin/coin-packages/actions";

export function CoinPackageRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="outline" render={<Link href={`/admin/coin-packages/${id}`} />}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Hapus paket koin ini?")) return;
          startTransition(async () => {
            await deleteCoinPackageAction(id);
            toast.success("Paket koin berhasil dihapus.");
          });
        }}
      >
        Hapus
      </Button>
    </div>
  );
}
