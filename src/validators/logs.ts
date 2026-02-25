import { z } from 'zod';

export const CreateLogSchema = z.object({
  habitId: z.number().int(),
  date: z.string().min(1), // ISO 8601 like "2026-02-15"
  note: z.string().max(200).optional(),
});

export type CreateLogInput = z.infer<typeof CreateLogSchema>;