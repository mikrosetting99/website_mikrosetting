import { z } from "zod";

export const notificationTypeSchema = z.enum(["INFO", "SUCCESS", "WARNING", "PROMO"]);

export const notificationSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter").max(150),
  message: z.string().min(2, "Pesan minimal 2 karakter").max(1000),
  type: notificationTypeSchema,
  isActive: z.boolean().default(true),
});

export type NotificationInput = z.infer<typeof notificationSchema>;
