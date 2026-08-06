import express from "express";

import {
    fetchCoaches,
    fetchCoachById,
    addCoach,
    editCoach,
    removeCoach
} from "../controllers/coachController.js";

import { validateCoach } from "../middleware/validateCoach.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL COACHES
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchCoaches
);

// GET COACH BY ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchCoachById
);

// CREATE COACH
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    validateCoach,
    addCoach
);

// UPDATE COACH
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    validateCoach,
    editCoach
);

// DELETE COACH
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    removeCoach
);

export default router;