"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { notificationSchema } from "@/lib/validators/notification";

export interface NotificationFormState {
  error?: string;
}

function parseForm(formData: FormData) {
  return notificationSchema.safeParse({
    title: formData.get("title"),
    message: formData.get("message"),
    type: formData.get("type"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createNotificationAction(
  _prevState: NotificationFormState,
  formData: FormData,
): Promise<NotificationFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await prisma.notification.create({ data: parsed.data });
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  redirect("/admin/notifications");
}

export async function updateNotificationAction(
  id: string,
  _prevState: NotificationFormState,
  formData: FormData,
): Promise<NotificationFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await prisma.notification.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/notifications");
  revalidatePath("/");
  redirect("/admin/notifications");
}

export async function deleteNotificationAction(id: string) {
  await prisma.notification.delete({ where: { id } });
  revalidatePath("/admin/notifications");
  revalidatePath("/");
}

export async function toggleNotificationActiveAction(id: string, isActive: boolean) {
  await prisma.notification.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/notifications");
  revalidatePath("/");
}
