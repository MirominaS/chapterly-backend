import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createBookController, getBooksController } from "../controllers/bookController.js";

const router = express.Router();

router.use(protect);

router.post("/",createBookController);
router.get("/",getBooksController)

export default router;