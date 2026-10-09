"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCoinPackageAction } from "@/app/admin/coin-packages/actions";
import type { CoinPackage } from "@/generated/prisma/client";

export function AdminCoinPackagesWidget({ coinPackages }: { coinPackages: CoinPackage[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Paket Koin</h2>
        <Link href="/admin/coin-packages" className="text-sm font-medium text-primary hover:underline">
          Kelola Paket &gt;
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">No</TableHead>
            <TableHead>Nama Paket</TableHead>
            <TableHead>Jumlah Koin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coinPackages.map((pkg, index) => (
            <TableRow key={pkg.id}>
              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell>{pkg.coinAmount.toLocaleString("id-ID")}</TableCell>
              <TableCell>
                <Badge variant={pkg.isActive ? "default" : "outline"}>
                  {pkg.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button size="icon-sm" variant="outline" render={<Link href={`/admin/coin-packages/${pkg.id}`} />}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    disabled={isPending}
                    onClick={() => {
                      if (!confirm("Hapus paket koin ini?")) return;
                      startTransition(async () => {
                        await deleteCoinPackageAction(pkg.id);
                        toast.success("Paket koin berhasil dihapus.");
                      });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {coinPackages.length === 0 && (
        <p className="p-6 text-center text-sm text-muted-foreground">Belum ada paket koin.</p>
      )}
    </section>
  );
}
