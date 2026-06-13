import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createThoughtController, deleteThoughtController, getThoughtByIdController, getThoughtsController, updateThoughtController } from "../controllers/thoughtController.js";

const router = express.Router();

router.use(protect);

router.post("/",createThoughtController);
router.get("/book/:book_id",getThoughtsController)
router.get("/:id",getThoughtByIdController)
router.put("/:id",updateThoughtController)
router.delete("/:id",deleteThoughtController)


export default router;