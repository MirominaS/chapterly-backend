import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { 
    createBookController, 
    deleteBookController, 
    getBookByIdController, 
    getBooksController, 
    updateController 
} from "../controllers/bookController.js";

const router = express.Router();

router.use(protect);

router.post("/",createBookController);
router.get("/",getBooksController);
router.get("/:id",getBookByIdController);
router.put("/:id",updateController);
router.delete("/:id",deleteBookController)

export default router;