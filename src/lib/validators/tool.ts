import { z } from "zod";

export const toolAccessTypeSchema = z.enum(["FREE", "COIN", "SUBSCRIBER"]);

export const toolSchema = z
  .object({
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    name: z.string().min(2, "Nama minimal 2 karakter").max(150),
    slug: z
      .string()
      .min(2)
      .max(150)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
    shortDescription: z.string().min(2).max(255),
    description: z.string().min(2),
    icon: z.string().max(100).optional().nullable(),
    accessType: toolAccessTypeSchema,
    coinCost: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number().int().default(0),
    isFeatured: z.boolean().default(false),
  })
  .refine((data) => data.accessType !== "COIN" || data.coinCost > 0, {
    message: "Biaya koin wajib lebih dari 0 jika akses berupa Pakai Koin",
    path: ["coinCost"],
  })
  .transform((data) => ({
    ...data,
    coinCost: data.accessType === "FREE" ? 0 : data.coinCost,
  }));

export const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  icon: z.string().max(100).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ToolInput = z.infer<typeof toolSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
