import express from "express";

import {
    fetchMemberships,
    fetchMembershipById,
    addMembership,
    checkMembershipAccess,
    renewMembership
} from "../controllers/membershipController.js";

import { validateMembership } from "../middleware/validateMembership.js";
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

// RENEW MEMBERSHIP
router.post(
    "/renew",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateMembership,
    renewMembership
);

export default router;