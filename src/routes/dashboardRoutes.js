import express from "express"

import {protect} from "../middleware/authMiddleware.js"
import { getDashboardStatsController, getRecentBooksController } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStatsController);
router.get("/recent-books",protect,getRecentBooksController)

export default router;