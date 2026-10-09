"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import { getSettings, updateSettings } from "@/lib/services/settings.service";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "logo");

export interface LogoActionResult {
  ok: boolean;
  message: string;
  logoUrl?: string;
}

function revalidateLogoPaths() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/settings");
}

async function removeUploadedFile(logoUrl: string) {
  if (!logoUrl.startsWith("/uploads/logo/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", logoUrl));
  } catch {
    // file may already be gone — not fatal
  }
}

export async function uploadLogoAction(formData: FormData): Promise<LogoActionResult> {
  const file = formData.get("logo_file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Pilih file logo terlebih dahulu." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, message: "Format file harus PNG, JPG, WEBP, GIF, atau SVG." };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, message: "Ukuran file maksimal 2MB." };
  }

  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const previous = await getSettings();
  const logoUrl = `/uploads/logo/${filename}`;
  await updateSettings({ logo_url: logoUrl });
  await removeUploadedFile(previous.logo_url);

  revalidateLogoPaths();
  return { ok: true, message: "Logo berhasil diunggah.", logoUrl };
}

export async function removeLogoAction(): Promise<LogoActionResult> {
  const previous = await getSettings();
  await updateSettings({ logo_url: "" });
  await removeUploadedFile(previous.logo_url);

  revalidateLogoPaths();
  return { ok: true, message: "Logo berhasil dihapus." };
}
