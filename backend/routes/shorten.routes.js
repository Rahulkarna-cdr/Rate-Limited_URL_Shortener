import { Router } from "express";
import { handleShortenUrl } from "../controllers/shorten.controller.js";

const router = Router();

router.post("/", handleShortenUrl);

export default router;