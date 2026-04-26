import { Router } from "express";
import { handleShortenUrl } from "../controllers/shorten.controller.js";
import { shortenRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/", shortenRateLimiter, handleShortenUrl );

export default router;