import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { createQuoteController, getQuotesController } from "../controllers/quoteController.js";
import { deleteBookController } from "../controllers/bookController.js";

const router = express.Router();

router.use(protect);

router.post("/",createQuoteController);
router.get("/book/:book_id", getQuotesController)
router.delete("/:id",deleteBookController)

export default router;