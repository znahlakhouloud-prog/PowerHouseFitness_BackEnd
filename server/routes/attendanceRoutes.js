import express from "express";

import {
    fetchAttendances,
    fetchAttendanceById,
    fetchAttendanceByUserId,
    checkIn
} from "../controllers/attendanceController.js";

import { validateAttendance } from "../middleware/validateAttendance.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles, authorizeOwnerOrRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all attendances
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchAttendances
);

// Get attendance history for one user (staff can view anyone's,
// a member only their own) - must come before /:id
router.get(
    "/user/:id_user",
    authenticateToken,
    authorizeOwnerOrRoles("id_user", "admin", "receptionist"),
    fetchAttendanceByUserId
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