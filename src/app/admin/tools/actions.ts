"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { toolSchema } from "@/lib/validators/tool";

export interface ToolFormState {
  error?: string;
}

function parseToolForm(formData: FormData) {
  return toolSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    icon: formData.get("icon") || null,
    accessType: formData.get("accessType"),
    coinCost: formData.get("coinCost") || 0,
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    isFeatured: formData.get("isFeatured") === "on",
  });
}

export async function createToolAction(
  _prevState: ToolFormState,
  formData: FormData,
): Promise<ToolFormState> {
  const parsed = parseToolForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await prisma.tool.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Slug sudah digunakan oleh tool lain." };
  }

  await prisma.tool.create({ data: parsed.data });
  revalidatePath("/admin/tools");
  revalidatePath("/");
  redirect("/admin/tools");
}

export async function updateToolAction(
  toolId: string,
  _prevState: ToolFormState,
  formData: FormData,
): Promise<ToolFormState> {
  const parsed = parseToolForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await prisma.tool.findFirst({
    where: { slug: parsed.data.slug, id: { not: toolId } },
  });
  if (existing) {
    return { error: "Slug sudah digunakan oleh tool lain." };
  }

  await prisma.tool.update({ where: { id: toolId }, data: parsed.data });
  revalidatePath("/admin/tools");
  revalidatePath("/");
  revalidatePath(`/tools/${parsed.data.slug}`);
  redirect("/admin/tools");
}

export async function deleteToolAction(toolId: string) {
  await prisma.tool.delete({ where: { id: toolId } });
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

export async function toggleToolActiveAction(toolId: string, isActive: boolean) {
  await prisma.tool.update({ where: { id: toolId }, data: { isActive } });
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

export async function duplicateToolAction(toolId: string) {
  const tool = await prisma.tool.findUniqueOrThrow({ where: { id: toolId } });
  let newSlug = `${tool.slug}-copy`;
  let suffix = 1;
  while (await prisma.tool.findUnique({ where: { slug: newSlug } })) {
    suffix += 1;
    newSlug = `${tool.slug}-copy-${suffix}`;
  }

  await prisma.tool.create({
    data: {
      categoryId: tool.categoryId,
      name: `${tool.name} (Copy)`,
      slug: newSlug,
      shortDescription: tool.shortDescription,
      description: tool.description,
      icon: tool.icon,
      accessType: tool.accessType,
      coinCost: tool.coinCost,
      isActive: false,
      sortOrder: tool.sortOrder,
      isFeatured: false,
    },
  });
  revalidatePath("/admin/tools");
}
