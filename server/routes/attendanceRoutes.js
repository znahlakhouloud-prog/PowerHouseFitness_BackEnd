import express from "express";

import {
    fetchAttendances,
    fetchAttendanceById,
    checkIn
} from "../controllers/attendanceController.js";

import { validateAttendance } from "../middleware/validateAttendance.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all attendances
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchAttendances
);

// Get attendance by ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchAttendanceById
);

// Member check-in
router.post(
    "/check-in",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateAttendance,
    checkIn
);

export default router;