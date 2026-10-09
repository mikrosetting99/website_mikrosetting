import { prisma } from "@/lib/db/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminToolUsagePage() {
  const usages = await prisma.toolUsage.findMany({
    include: { user: true, tool: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Riwayat Tool</h1>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Koin Digunakan</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usages.map((usage) => (
              <TableRow key={usage.id}>
                <TableCell className="font-medium">{usage.user.name}</TableCell>
                <TableCell>{usage.tool.name}</TableCell>
                <TableCell>{usage.coinSpent > 0 ? usage.coinSpent : "FREE"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {usage.createdAt.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {usages.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada penggunaan tool.</p>
        )}
      </div>
    </div>
  );
}
