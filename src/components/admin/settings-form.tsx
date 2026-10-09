"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { updateSettingsAction, type SettingsFormState } from "@/app/admin/settings/actions";
import type { SettingKey } from "@/lib/services/settings.service";

export function SettingsForm({ settings }: { settings: Record<SettingKey, string> }) {
  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    updateSettingsAction,
    {},
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">Informasi Umum</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="site_name">Nama Website</Label>
          <Input id="site_name" name="site_name" defaultValue={settings.site_name} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Logo</Label>
          <LogoUploader siteName={settings.site_name} logoUrl={settings.logo_url || undefined} />
          <p className="text-xs text-muted-foreground">
            Tampil di header situs &amp; admin panel. Tanpa logo, dipakai lambang huruf default.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} placeholder="628xxxxxxxxxx" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={settings.email} />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border p-4">
        <h2 className="text-sm font-semibold text-foreground">Tampilan Hero Banner</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_badge">Label Kecil</Label>
          <Input id="hero_badge" name="hero_badge" defaultValue={settings.hero_badge} placeholder="Koleksi Lengkap" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_title">Judul</Label>
          <Textarea id="hero_title" name="hero_title" defaultValue={settings.hero_title} rows={2} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_subtitle">Subjudul</Label>
          <Textarea id="hero_subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle} rows={2} />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="text-sm font-semibold text-foreground">Fitur</h2>
        <ToggleRow name="maintenance_mode" label="Maintenance Mode" defaultChecked={settings.maintenance_mode === "true"} />
        <ToggleRow name="registration_enabled" label="Registrasi User Aktif" defaultChecked={settings.registration_enabled === "true"} />
        <ToggleRow name="coin_system_enabled" label="Coin System Aktif" defaultChecked={settings.coin_system_enabled === "true"} />
        <ToggleRow name="subscription_enabled" label="Subscription Aktif" defaultChecked={settings.subscription_enabled === "true"} />
      </section>

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
