import express from "express";

import {
    fetchMemberships,
    fetchMembershipById,
    addMembership,
    editMembership,
    checkMembershipAccess,
    renewMembership
} from "../controllers/membershipController.js";

import { validateMembership } from "../middleware/validateMembership.js";
import { validateUpdateMembership } from "../middleware/validateUpdateMembership.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET ALL MEMBERSHIPS
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchMemberships
);

// CHECK MEMBER ACCESS
router.get(
    "/check/:id_user",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "coach"),
    checkMembershipAccess
);

// GET MEMBERSHIP BY ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchMembershipById
);

// CREATE MEMBERSHIP
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateMembership,
    addMembership
);

// UPDATE MEMBERSHIP
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateUpdateMembership,
    editMembership
);

// RENEW MEMBERSHIP
router.post(
    "/renew",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateMembership,
    renewMembership
);

export default router;