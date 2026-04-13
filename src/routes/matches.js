import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validations/matches.js";
import { getMatchStatus } from "../utils/match-status.js";
import { error } from "console";

export const matchRouter = Router();

matchRouter.get('/', async (req,res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if(!parsed.success){
    return res.status(400).json({ error: 'Invalid query',details:parsed.error.issues})
  }
  const limit = Math.min(parsedData.data.limit ?? 50, MAX_LIMIT);
  try {
    const data = await db
          .select()
          .from(matches)
          .orderBy((desc(matches.createdAt)))
          .limit(limit)

          res.json({ data })
  } catch (error) {
    res.status(500).json({ error: 'Failed to list matches'})
  }
})

matchRouter.post('/', async (req,res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    

    if(!parsed.success){
        return res.status(400).json({
            error: 'INVALID PAYLOAD', details: parsed.error.issues
        })
    }
    const { data: { startTime, endTime, homeScore, awayScore}} = parsed;
    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            startTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();
        if(res.app.locals.broadcastMatchCreated){
            res.app.locals.broadcastMatchCreated
        }
        res.status(201).json({ data:event })
    } catch (e) {
        res.status(500).json({
            error: "failed to create match",
            details:JSON.stringify(e)
        })
    }
})