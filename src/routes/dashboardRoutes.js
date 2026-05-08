import express from "express"

import {protect} from "../middleware/authMiddleware.js"
import { getDashboardStatsController } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStatsController);

export default router;