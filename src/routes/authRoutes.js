import express from "express"
import { registerController, loginController, getUserController } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/user",protect,getUserController)

export default router;