import { z } from "zod";

export const Input = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  preview: z.string().min(1),
  adminKey: z.string().min(1),
});
export type TInput = z.infer<typeof Input>;

export const Output = z.object({
  slug: z.string(),
});
export type TOutput = z.infer<typeof Output>;
