"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { subscribeToPlanAction } from "@/app/coins/actions";

export function SubscribeButton({ planId }: { planId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await subscribeToPlanAction(planId);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={handleClick} disabled={isPending} className="w-full">
      {isPending ? "Memproses..." : "Subscribe"}
    </Button>
  );
}
