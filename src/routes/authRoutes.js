import express from "express"
import { registerController, loginController, getUserController, googleAuthController } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/user",protect,getUserController)
router.post("/google",googleAuthController)

export default router;