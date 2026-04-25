import { Router } from "express"
import { getShortUrlAnalytics } from "../controllers/analytics.controller.js"
const router = Router()


router.get('/:shortCode', getShortUrlAnalytics)

export default router;

