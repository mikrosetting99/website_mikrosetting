"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validators/tool";

export interface CategoryFormState {
  error?: string;
}

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    icon: formData.get("icon") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Slug sudah digunakan oleh kategori lain." };
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const existing = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, id: { not: categoryId } },
  });
  if (existing) {
    return { error: "Slug sudah digunakan oleh kategori lain." };
  }

  await prisma.category.update({ where: { id: categoryId }, data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string) {
  const toolCount = await prisma.tool.count({ where: { categoryId } });
  if (toolCount > 0) {
    throw new Error("Kategori masih memiliki tools, pindahkan atau hapus tools terlebih dahulu.");
  }
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function toggleCategoryActiveAction(categoryId: string, isActive: boolean) {
  await prisma.category.update({ where: { id: categoryId }, data: { isActive } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
