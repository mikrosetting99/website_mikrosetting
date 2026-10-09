import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategoryAction } from "@/app/admin/categories/actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit Kategori</h1>
      <CategoryForm
        category={category}
        action={updateCategoryAction.bind(null, category.id)}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
