import { prisma } from "@/lib/db/prisma";

export const SETTING_KEYS = [
  "site_name",
  "logo_url",
  "whatsapp",
  "email",
  "maintenance_mode",
  "registration_enabled",
  "coin_system_enabled",
  "subscription_enabled",
  "hero_badge",
  "hero_title",
  "hero_subtitle",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

const DEFAULTS: Record<SettingKey, string> = {
  site_name: "Mikrosetting",
  logo_url: "",
  whatsapp: "",
  email: "",
  maintenance_mode: "false",
  registration_enabled: "true",
  coin_system_enabled: "true",
  subscription_enabled: "true",
  hero_badge: "Koleksi Lengkap",
  hero_title: "Template, Script, dan Tools untuk Jaringan Anda",
  hero_subtitle:
    "Solusi praktis untuk setting MikroTik, Hotspot, OLT, VPN, dan kebutuhan jaringan lainnya dalam satu tempat.",
};

export async function getSettings(): Promise<Record<SettingKey, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...SETTING_KEYS] } } });
  const map = new Map(rows.map((row) => [row.key, row.value]));

  return SETTING_KEYS.reduce((acc, key) => {
    acc[key] = map.get(key) ?? DEFAULTS[key];
    return acc;
  }, {} as Record<SettingKey, string>);
}

export async function updateSettings(values: Partial<Record<SettingKey, string>>) {
  const entries = Object.entries(values) as [SettingKey, string][];
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
}
