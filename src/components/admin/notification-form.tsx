"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotificationFormState } from "@/app/admin/notifications/actions";
import type { Notification } from "@/generated/prisma/client";

interface NotificationFormProps {
  notification?: Notification;
  action: (prevState: NotificationFormState, formData: FormData) => Promise<NotificationFormState>;
  submitLabel: string;
}

const TYPE_LABEL: Record<string, string> = {
  INFO: "Info",
  SUCCESS: "Sukses / Promo Positif",
  WARNING: "Peringatan",
  PROMO: "Promo",
};

export function NotificationForm({ notification, action, submitLabel }: NotificationFormProps) {
  const [state, formAction, isPending] = useActionState<NotificationFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Judul</Label>
        <Input id="title" name="title" defaultValue={notification?.title} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Pesan</Label>
        <Textarea id="message" name="message" defaultValue={notification?.message} rows={4} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Tipe</Label>
        <Select name="type" defaultValue={notification?.type ?? "INFO"}>
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Pilih tipe" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={notification?.isActive ?? true} />
        Aktif (langsung tampil ke pelanggan)
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
