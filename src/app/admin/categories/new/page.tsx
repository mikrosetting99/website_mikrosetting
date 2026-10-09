import { CategoryForm } from "@/components/admin/category-form";
import { createCategoryAction } from "@/app/admin/categories/actions";

export default function NewCategoryPage() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Tambah Kategori</h1>
      <CategoryForm action={createCategoryAction} submitLabel="Simpan Kategori" />
    </div>
  );
}
