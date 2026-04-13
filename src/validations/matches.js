import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchSchema = z.object({
  sport: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
});

const dateOrEpochSchema = z.union([
  z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Invalid date-time string",
    }),
  z.coerce.number().int().nonnegative(),
]);

export const createMatchSchema = matchSchema
  .extend({
    startTime: dateOrEpochSchema,
    endTime: dateOrEpochSchema,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start =
      typeof data.startTime === "number"
        ? new Date(data.startTime)
        : new Date(data.startTime);

    const end =
      typeof data.endTime === "number"
        ? new Date(data.endTime)
        : new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime must be after startTime",
        path: ["endTime"],
      });
    }
  });

export const updatedScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});