"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  deleteNotificationAction,
  toggleNotificationActiveAction,
} from "@/app/admin/notifications/actions";

export function NotificationRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleNotificationActiveAction(id, checked);
          })
        }
      />
      <Button size="sm" variant="outline" render={<Link href={`/admin/notifications/${id}`} />}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Hapus notifikasi ini?")) return;
          startTransition(async () => {
            await deleteNotificationAction(id);
            toast.success("Notifikasi berhasil dihapus.");
          });
        }}
      >
        Hapus
      </Button>
    </div>
  );
}
