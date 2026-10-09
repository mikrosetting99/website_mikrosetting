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

export default async function AdminSubscribersPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: { user: true, plan: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Subscriber</h1>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Mulai</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => {
              const isActive = sub.status === "ACTIVE" && sub.endDate >= new Date();
              return (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.user.name}</TableCell>
                  <TableCell>{sub.plan.name}</TableCell>
                  <TableCell>{sub.startDate.toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{sub.endDate.toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "outline"}>
                      {isActive ? "Aktif" : sub.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {subscriptions.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada subscriber.</p>
        )}
      </div>
    </div>
  );
}
