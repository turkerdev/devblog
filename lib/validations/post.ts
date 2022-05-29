import { z } from "zod";

export const CreateInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  preview: z.string().min(1),
  adminKey: z.string().min(1),
});
export type TCreateInput = z.infer<typeof CreateInput>;

export const CreateOutput = z.object({
  slug: z.string(),
});
export type TCreateOutput = z.infer<typeof CreateOutput>;

export const DeleteInput = z.object({
  slug: z.string().min(1),
  adminKey: z.string().min(1),
});
export type TDeleteInput = z.infer<typeof DeleteInput>;

export const PatchInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  preview: z.string().min(1),
  adminKey: z.string().min(1),
});
export type TPatchInput = z.infer<typeof PatchInput>;
