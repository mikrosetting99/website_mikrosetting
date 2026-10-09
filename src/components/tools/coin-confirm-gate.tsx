"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Coins } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { openToolAction } from "@/app/tools/[slug]/actions";
import { ToolContent } from "./tool-content";

interface CoinConfirmGateProps {
  toolSlug: string;
  toolName: string;
  coinCost: number;
  coinBalance: number;
}

export function CoinConfirmGate({ toolSlug, toolName, coinCost, coinBalance }: CoinConfirmGateProps) {
  const [stage, setStage] = useState<"confirm" | "insufficient" | "unlocked">("confirm");
  const [balance, setBalance] = useState(coinBalance);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await openToolAction(toolSlug);
      if (result.ok) {
        if (result.balanceAfter !== undefined) setBalance(result.balanceAfter);
        setStage("unlocked");
        return;
      }

      if (result.code === "INSUFFICIENT_COIN") {
        setStage("insufficient");
        return;
      }

      // UNAUTHORIZED / NOT_FOUND / UNKNOWN shouldn't normally happen here
      // since the page already gated on session + tool existence.
      setStage("insufficient");
    });
  }

  if (stage === "unlocked") {
    return <ToolContent slug={toolSlug} name={toolName} />;
  }

  return (
    <Dialog open>
      {stage === "confirm" ? (
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Gunakan Tool Ini?</DialogTitle>
            <DialogDescription>{toolName}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Coins className="h-4 w-4" /> Biaya
            </span>
            <span className="font-semibold">{coinCost} Koin</span>
          </div>
          <div className="flex items-center justify-between px-1 text-sm text-muted-foreground">
            <span>Saldo Anda</span>
            <span className="font-medium text-foreground">{balance} Koin</span>
          </div>

          <DialogFooter>
            <Button variant="outline" render={<Link href="/" />}>
              Batal
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Memproses..." : `Gunakan ${coinCost} Koin`}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Saldo Koin Tidak Cukup</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dibutuhkan</span>
              <span className="font-semibold">{coinCost} Koin</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Saldo Anda</span>
              <span className="font-semibold">{balance} Koin</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" render={<Link href="/" />}>
              Batal
            </Button>
            <Button render={<Link href="/coins" />}>Isi Koin</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
