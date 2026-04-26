import { Router } from "express";
import { handleShortenUrl, handleRecentLinks } from "../controllers/shorten.controller.js";
import { shortenRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/", shortenRateLimiter, handleShortenUrl);
router.get("/recent", handleRecentLinks)

export default router;