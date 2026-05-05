import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createThoughtController } from "../controllers/thoughtController.js";

const router = express.Router();

router.use(protect);

router.post("/",createThoughtController);

export default router;