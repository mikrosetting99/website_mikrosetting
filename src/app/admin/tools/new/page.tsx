import { prisma } from "@/lib/db/prisma";
import { ToolForm } from "@/components/admin/tool-form";
import { createToolAction } from "@/app/admin/tools/actions";

export default async function NewToolPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-xl font-semibold">Tambah Tool</h1>
      <ToolForm categories={categories} action={createToolAction} submitLabel="Simpan Tool" />
    </div>
  );
}
