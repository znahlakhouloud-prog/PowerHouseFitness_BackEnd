import express from "express";
import {login,register,changePassword} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.post("/login",login);
router.post("/register",validateUser,register);
router.patch("/change-password",authenticateToken,changePassword);

export default router;
