import { getSettings } from "@/lib/services/settings.service";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Pengaturan</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
