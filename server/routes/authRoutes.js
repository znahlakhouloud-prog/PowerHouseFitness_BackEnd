import express from "express";
import {login,register,changePassword,forgotPassword,resetPassword} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validateUser.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login",login);
router.post(
    "/register",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateUser,
    register
);
router.patch("/change-password",authenticateToken,changePassword);
router.post(
    "/forgot-password",
    forgotPassword
);

router.patch(
    "/reset-password",
    resetPassword
);
export default router;
