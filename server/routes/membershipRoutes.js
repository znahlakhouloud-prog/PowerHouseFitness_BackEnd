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
import { authorizeRoles, authorizeOwnerOrRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET ALL MEMBERSHIPS
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchMemberships
);

// CHECK MEMBER ACCESS (also used by a member to fetch their own
// current membership - hence the ownership check, not just roles)
router.get(
    "/check/:id_user",
    authenticateToken,
    authorizeOwnerOrRoles("id_user", "admin", "receptionist", "coach"),
    checkMembershipAccess
);

// GET MEMBERSHIP BY ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchMembershipById
);

// CREATE MEMBERSHIP (member allowed - self-service subscribe when
// they don't already have an active one; id_user is forced to their
// own id in the controller regardless of what's in the body)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "member"),
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