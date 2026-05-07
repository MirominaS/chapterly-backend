import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { createQuoteController, getQuotesController } from "../controllers/quoteController.js";

const router = express.Router();

router.use(protect);

router.post("/",createQuoteController);
router.get("/book/:book_id", getQuotesController)

export default router;