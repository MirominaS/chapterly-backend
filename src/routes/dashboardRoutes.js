import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  getDashboardStatsController,
  getGenreAnalyticsController,
  getRecentBooksController,
  getLanguageAnalyticsController,
  getFormatAnalyticsController,
  getMonthlyCompletedController,
  getCurrentlyReadingController
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStatsController);
router.get("/recent-books", protect, getRecentBooksController);
router.get("/genres", protect, getGenreAnalyticsController);
router.get("/languages", protect, getLanguageAnalyticsController);
router.get("/formats", protect, getFormatAnalyticsController);
router.get("/monthly-completed", protect, getMonthlyCompletedController);
router.get("/currently-reading", protect, getCurrentlyReadingController);

export default router;
