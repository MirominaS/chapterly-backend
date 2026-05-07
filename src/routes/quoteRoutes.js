import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { createQuoteController } from "../controllers/quoteController.js";

const router = express.Router();

router.use(protect);

router.post("/",createQuoteController);

export default router;