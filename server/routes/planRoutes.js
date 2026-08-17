import express from "express";

import {
    fetchPlans,
    addPlan,
    editPlan,
    removePlan
} from "../controllers/planController.js";

import { validatePlan } from "../middleware/validatePlan.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin-only catalog of membership plans
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/", fetchPlans);

router.post("/", validatePlan, addPlan);

router.put("/:id", validatePlan, editPlan);

router.delete("/:id", removePlan);

export default router;
