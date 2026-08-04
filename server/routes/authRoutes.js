import express from "express";
import {login,changePassword} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login",login);
router.patch("/change-password",authenticateToken,changePassword);

export default router;