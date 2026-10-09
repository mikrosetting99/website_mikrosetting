"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buyCoinPackageAction } from "@/app/coins/actions";

export function BuyCoinButton({ coinPackageId }: { coinPackageId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await buyCoinPackageAction(coinPackageId);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={isPending} className="w-full">
      {isPending ? "Memproses..." : "Beli Sekarang"}
    </Button>
  );
}
