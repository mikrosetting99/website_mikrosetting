import { z } from "zod";

export const coinPackageSchema = z.object({
  name: z.string().min(2).max(100),
  coinAmount: z.coerce.number().int().min(1),
  price: z.coerce.number().int().min(0),
  bonusCoin: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type CoinPackageInput = z.infer<typeof coinPackageSchema>;
