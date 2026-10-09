"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adjustUserCoinAction } from "@/app/admin/users/actions";

export function AdjustCoinDialog({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await adjustUserCoinAction(userId, {}, formData);
      if (result.success) {
        toast.success("Saldo koin berhasil disesuaikan.");
        setError(null);
        setOpen(false);
        return;
      }
      setError(result.error ?? "Gagal menyesuaikan saldo.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        Sesuaikan Koin
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sesuaikan Saldo Koin — {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Jumlah (gunakan angka negatif untuk mengurangi)</Label>
            <Input id="amount" name="amount" type="number" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Keterangan</Label>
            <Input id="description" name="description" placeholder="Bonus event, koreksi, dll." />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
