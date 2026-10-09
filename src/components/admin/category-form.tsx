"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CategoryFormState } from "@/app/admin/categories/actions";
import type { Category } from "@/generated/prisma/client";

interface CategoryFormProps {
  category?: Category;
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  submitLabel: string;
}

export function CategoryForm({ category, action, submitLabel }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState<CategoryFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama Kategori</Label>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="mikrotik" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="icon">Icon</Label>
        <Input id="icon" name="icon" defaultValue={category?.icon ?? ""} placeholder="router" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sortOrder">Urutan</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={category?.isActive ?? true} />
        Aktif
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
