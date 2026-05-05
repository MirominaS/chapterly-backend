import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createThoughtController, deleteThoughtController, getThoughtsController } from "../controllers/thoughtController.js";

const router = express.Router();

router.use(protect);

router.post("/",createThoughtController);
router.get("/book/:book_id",getThoughtsController)
router.delete("/:id",deleteThoughtController)

export default router;