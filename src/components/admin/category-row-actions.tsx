"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { deleteCategoryAction, toggleCategoryActiveAction } from "@/app/admin/categories/actions";

export function CategoryRowActions({ categoryId, isActive }: { categoryId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleCategoryActiveAction(categoryId, checked);
          })
        }
      />
      <Button size="sm" variant="outline" render={<Link href={`/admin/categories/${categoryId}`} />}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Hapus kategori ini?")) return;
          startTransition(async () => {
            try {
              await deleteCategoryAction(categoryId);
              toast.success("Kategori berhasil dihapus.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Gagal menghapus kategori.");
            }
          });
        }}
      >
        Hapus
      </Button>
    </div>
  );
}
