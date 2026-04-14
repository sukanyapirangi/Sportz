import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validations/matches.js";
import { getMatchStatus } from "../utils/match-status.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { desc } from "drizzle-orm";

const MAX_LIMIT = 100;

export const matchRouter = Router();

matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.issues });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to list matches" });
  }
});

matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "INVALID PAYLOAD",
      details: parsed.error.issues,
    });
  }

  const {
    startTime,
    endTime,
    homeScore,
    awayScore,
    ...rest
  } = parsed.data;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...rest,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    return res.status(201).json({ data: event });
  } catch (e) {
    return res.status(500).json({
      error: "failed to create match",
      details: e instanceof Error ? e.message : String(e),
    });
  }
});