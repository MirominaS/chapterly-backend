import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createBookController } from "../controllers/bookController.js";

const router = express.Router();

router.use(protect);

router.post("/",createBookController);

export default router;