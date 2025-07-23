import { Router, Request, Response } from "express";
import { scoreSpam } from "../spam/scorer";
import type { SpamResult, SocialPlatform } from "../types/spam-route";

type SpamRequestBody = {
  text: unknown;
  platforms: unknown;
};

type SpamResponse = SpamResult & { platforms: SocialPlatform[] };

const router = Router();

/**
 * POST /api/score
 * body: { text: string; platforms: string[] }
 * returns: SpamResponse
 */
router.post(
  "/",
  (
    req: Request<
      Record<string, never>,
      SpamResponse | { error: string },
      SpamRequestBody
    >,
    res: Response<SpamResponse | { error: string }>
  ) => {
    const { text, platforms } = req.body;

    if (typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "`text` field is required and must be a string." });
    }
    if (
      !Array.isArray(platforms) ||
      !platforms.every((p): p is SocialPlatform => typeof p === "string")
    ) {
      return res
        .status(400)
        .json({ error: "`platforms` must be an array of strings." });
    }

    try {
      const result: SpamResult = scoreSpam(text);
      const payload: SpamResponse = { ...result, platforms };
      return res.json(payload);
    } catch (err) {
      console.error("Error scoring text:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
