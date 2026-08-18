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

router.use(authenticateToken);

// Admin and receptionist can browse the catalog (e.g. to assign a
// plan at registration); only admin can manage it.
router.get(
    "/",
    authorizeRoles("admin", "receptionist"),
    fetchPlans
);

router.post(
    "/",
    authorizeRoles("admin"),
    validatePlan,
    addPlan
);

router.put(
    "/:id",
    authorizeRoles("admin"),
    validatePlan,
    editPlan
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    removePlan
);

export default router;
