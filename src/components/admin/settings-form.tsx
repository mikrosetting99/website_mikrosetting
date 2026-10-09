"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateSettingsAction, type SettingsFormState } from "@/app/admin/settings/actions";
import type { SettingKey } from "@/lib/services/settings.service";

export function SettingsForm({ settings }: { settings: Record<SettingKey, string> }) {
  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    updateSettingsAction,
    {},
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="site_name">Nama Website</Label>
        <Input id="site_name" name="site_name" defaultValue={settings.site_name} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="logo_url">URL Logo</Label>
        <Input id="logo_url" name="logo_url" defaultValue={settings.logo_url} placeholder="/logo.png" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} placeholder="628xxxxxxxxxx" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={settings.email} />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <ToggleRow name="maintenance_mode" label="Maintenance Mode" defaultChecked={settings.maintenance_mode === "true"} />
        <ToggleRow name="registration_enabled" label="Registrasi User Aktif" defaultChecked={settings.registration_enabled === "true"} />
        <ToggleRow name="coin_system_enabled" label="Coin System Aktif" defaultChecked={settings.coin_system_enabled === "true"} />
        <ToggleRow name="subscription_enabled" label="Subscription Aktif" defaultChecked={settings.subscription_enabled === "true"} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">Pengaturan berhasil disimpan.</p>}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </form>
  );
}

function ToggleRow({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between text-sm">
      {label}
      <Switch name={name} defaultChecked={defaultChecked} />
    </label>
  );
}
