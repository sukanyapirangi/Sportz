import { z } from "zod";

export const listcommentaryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const createCommentarySchema = z.object({
  minutes: z.coerce.number().int().nonnegative(),
  sequence: z.coerce.number().int().nonnegative(),
  period: z.string().optional(),
  eventtype: z.string().optional(),
  actor: z.string().optional(),
  teammessage: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).default([]),
});
