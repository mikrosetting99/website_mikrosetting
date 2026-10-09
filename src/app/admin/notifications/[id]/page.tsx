import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { NotificationForm } from "@/components/admin/notification-form";
import { updateNotificationAction } from "@/app/admin/notifications/actions";

export default async function EditNotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) notFound();

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit Notifikasi</h1>
      <NotificationForm
        notification={notification}
        action={updateNotificationAction.bind(null, notification.id)}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
