import { NotificationForm } from "@/components/admin/notification-form";
import { createNotificationAction } from "@/app/admin/notifications/actions";

export default function NewNotificationPage() {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <h1 className="text-xl font-semibold">Tambah Notifikasi</h1>
      <NotificationForm action={createNotificationAction} submitLabel="Kirim Notifikasi" />
    </div>
  );
}
