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

// Admin/receptionist browse the catalog to assign a plan; members
// browse it to choose one themselves. Only admin can manage it.
router.get(
    "/",
    authorizeRoles("admin", "receptionist", "member"),
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
