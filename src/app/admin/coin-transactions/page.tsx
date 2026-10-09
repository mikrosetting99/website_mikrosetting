import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCoinTransactionsPage() {
  const transactions = await prisma.coinTransaction.findMany({
    include: { user: true, tool: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Transaksi Koin</h1>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Saldo Sebelum</TableHead>
              <TableHead>Saldo Sesudah</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.user.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.type}</Badge>
                </TableCell>
                <TableCell className={tx.amount < 0 ? "text-destructive" : "text-emerald-600"}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </TableCell>
                <TableCell>{tx.balanceBefore}</TableCell>
                <TableCell>{tx.balanceAfter}</TableCell>
                <TableCell>{tx.tool?.name ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {tx.createdAt.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {transactions.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  );
}
