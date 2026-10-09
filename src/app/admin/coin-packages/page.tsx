import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
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
import { CoinPackageRowActions } from "@/components/admin/coin-package-row-actions";

export default async function AdminCoinPackagesPage() {
  const packages = await prisma.coinPackage.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Paket Koin</h1>
        <Button render={<Link href="/admin/coin-packages/new" />}>Tambah Paket</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jumlah Koin</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.coinAmount}</TableCell>
                <TableCell>{pkg.bonusCoin}</TableCell>
                <TableCell>Rp{pkg.price.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? "default" : "outline"}>
                    {pkg.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CoinPackageRowActions id={pkg.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {packages.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada paket koin.</p>
        )}
      </div>
    </div>
  );
}
