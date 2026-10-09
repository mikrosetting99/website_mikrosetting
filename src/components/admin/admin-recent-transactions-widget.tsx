import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CoinTransaction, User } from "@/generated/prisma/client";

type TransactionWithUser = CoinTransaction & { user: User };

export function AdminRecentTransactionsWidget({
  transactions,
}: {
  transactions: TransactionWithUser[];
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
        <Link href="/admin/coin-transactions" className="text-sm font-medium text-primary hover:underline">
          Lihat Semua &gt;
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">No</TableHead>
            <TableHead>Pengguna</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <TableRow key={tx.id}>
              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="font-medium">{tx.user.name}</TableCell>
              <TableCell className="text-muted-foreground">{tx.type}</TableCell>
              <TableCell className={tx.amount < 0 ? "text-destructive" : "text-emerald-600"}>
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {tx.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {transactions.length === 0 && (
        <p className="p-6 text-center text-sm text-muted-foreground">Belum ada transaksi.</p>
      )}
    </section>
  );
}
