"use client";

import { useActionState, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolFormState } from "@/app/admin/tools/actions";
import type { Category, Tool } from "@/generated/prisma/client";

interface ToolFormProps {
  categories: Category[];
  tool?: Tool;
  action: (prevState: ToolFormState, formData: FormData) => Promise<ToolFormState>;
  submitLabel: string;
}

export function ToolForm({ categories, tool, action, submitLabel }: ToolFormProps) {
  const [state, formAction, isPending] = useActionState<ToolFormState, FormData>(action, {});
  const [accessType, setAccessType] = useState(tool?.accessType ?? "FREE");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nama Tool</Label>
          <Input id="name" name="name" defaultValue={tool?.name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={tool?.slug} placeholder="vpn-mikrotik" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Kategori</Label>
          <Select name="categoryId" defaultValue={tool?.categoryId}>
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" defaultValue={tool?.icon ?? ""} placeholder="router" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
        <Input id="shortDescription" name="shortDescription" defaultValue={tool?.shortDescription} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Deskripsi Lengkap</Label>
        <Textarea id="description" name="description" defaultValue={tool?.description} rows={4} required />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Pengaturan Akses</p>
        <div className="flex flex-col gap-2">
          {(["FREE", "COIN", "SUBSCRIBER"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="accessType"
                value={type}
                defaultChecked={(tool?.accessType ?? "FREE") === type}
                onChange={() => setAccessType(type)}
              />
              {type === "FREE" ? "Free" : type === "COIN" ? "Pakai Koin" : "Subscriber Only"}
            </label>
          ))}
        </div>

        {accessType === "COIN" && (
          <div className="mt-3 flex flex-col gap-1.5">
            <Label htmlFor="coinCost">Biaya Koin</Label>
            <Input
              id="coinCost"
              name="coinCost"
              type="number"
              min={1}
              defaultValue={tool?.coinCost || 10}
              className="w-32"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sortOrder">Urutan</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={tool?.sortOrder ?? 0} />
        </div>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <Switch name="isActive" defaultChecked={tool?.isActive ?? true} />
          Aktif
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <Switch name="isFeatured" defaultChecked={tool?.isFeatured ?? false} />
          Featured
        </label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
