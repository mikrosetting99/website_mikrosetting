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
import { NotificationRowActions } from "@/components/admin/notification-row-actions";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            Pemberitahuan yang tampil di ikon lonceng dashboard pelanggan.
          </p>
        </div>
        <Button render={<Link href="/admin/notifications/new" />}>Tambah Notifikasi</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="max-w-xs truncate font-medium">{notification.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{notification.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {notification.createdAt.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge variant={notification.isActive ? "default" : "outline"}>
                    {notification.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <NotificationRowActions id={notification.id} isActive={notification.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {notifications.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada notifikasi.</p>
        )}
      </div>
    </div>
  );
}
