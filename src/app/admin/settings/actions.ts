"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/lib/services/settings.service";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  try {
    await updateSettings({
      site_name: String(formData.get("site_name") ?? ""),
      logo_url: String(formData.get("logo_url") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      email: String(formData.get("email") ?? ""),
      maintenance_mode: formData.get("maintenance_mode") === "on" ? "true" : "false",
      registration_enabled: formData.get("registration_enabled") === "on" ? "true" : "false",
      coin_system_enabled: formData.get("coin_system_enabled") === "on" ? "true" : "false",
      subscription_enabled: formData.get("subscription_enabled") === "on" ? "true" : "false",
      hero_badge: String(formData.get("hero_badge") ?? ""),
      hero_title: String(formData.get("hero_title") ?? ""),
      hero_subtitle: String(formData.get("hero_subtitle") ?? ""),
    });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan pengaturan." };
  }
}
