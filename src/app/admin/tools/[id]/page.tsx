import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { ToolForm } from "@/components/admin/tool-form";
import { updateToolAction } from "@/app/admin/tools/actions";

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tool, categories] = await Promise.all([
    prisma.tool.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!tool) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit Tool</h1>
      <ToolForm
        categories={categories}
        tool={tool}
        action={updateToolAction.bind(null, tool.id)}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
