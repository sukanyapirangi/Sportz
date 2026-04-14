import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { createCommentarySchema } from "../validations/commentary.js";
import { matchParamsSchema } from "../validations/matches.js";

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", (req, res) => {
  res.status(200).json({ message: "commentary list  " });
});

commentaryRouter.post("/", async (req, res) => {
  const paramsParsed = matchParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: "Invalid params",
      details: paramsParsed.error.issues,
    });
  }

  const bodyParsed = createCommentarySchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: bodyParsed.error.issues,
    });
  }

  const { id: matchId } = paramsParsed.data;
  const {
    minutes,
    sequence,
    period,
    eventtype,
    actor,
    teammessage,
    metadata,
    tags,
  } = bodyParsed.data;

  try {
    const [row] = await db
      .insert(commentary)
      .values({
        matchId,
        minute: minutes,
        sequence,
        period: period ?? null,
        eventType: eventtype ?? null,
        actor: actor ?? null,
        message: teammessage,
        metadata: metadata ?? null,
        tags,
      })
      .returning();

    return res.status(201).json({ data: row });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create commentary",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});
