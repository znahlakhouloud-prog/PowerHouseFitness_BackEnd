import express from "express";

import {
    fetchPayments,
    fetchPaymentById,
    fetchPaymentsByMembership,
    addPayment,
    addMyPayment,
    editPayment,
    removePayment
} from "../controllers/paymentController.js";

import { validatePayment } from "../middleware/validatePayment.js";
import { validateMemberPayment } from "../middleware/validateMemberPayment.js";
import { handleReceiptUpload } from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL PAYMENTS
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchPayments
);

// GET PAYMENT BY ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchPaymentById
);

// GET PAYMENTS OF A MEMBERSHIP (member allowed - ownership is
// enforced in the service since this is keyed by membership, not user)
router.get(
    "/membership/:id_membership",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "member"),
    fetchPaymentsByMembership
);

// CREATE PAYMENT (member self-service - card mock-approved instantly,
// bank transfer pending with an optional receipt file)
router.post(
    "/me",
    authenticateToken,
    authorizeRoles("member"),
    handleReceiptUpload,
    validateMemberPayment,
    addMyPayment
);

// CREATE PAYMENT
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validatePayment,
    addPayment
);

// UPDATE PAYMENT
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validatePayment,
    editPayment
);

// DELETE PAYMENT
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    removePayment
);

export default router;