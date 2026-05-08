import express from "express"

import {protect} from "../middleware/authMiddleware.js"
import { getDashboardStatsController, getGenreAnalyticsController, getRecentBooksController,getLanguageAnalyticsController, getFormatAnalyticsController } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStatsController);
router.get("/recent-books",protect,getRecentBooksController);
router.get("/genres",protect,getGenreAnalyticsController);
router.get("/languages",protect,getLanguageAnalyticsController);
router.get("/formats",protect,getFormatAnalyticsController)

export default router;