import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { createQuoteController, deleteQuoteController, getQuoteByIdController, getQuotesController, updateQuoteController } from "../controllers/quoteController.js";

const router = express.Router();

router.use(protect);

router.post("/",createQuoteController);
router.get("/book/:book_id", getQuotesController)
router.get("/:id", getQuoteByIdController)
router.put("/:id",updateQuoteController)
router.delete("/:id",deleteQuoteController)

export default router;