import express from "express";

import {
    fetchPayments,
    fetchPaymentById,
    fetchPaymentsByMembership,
    fetchInvoice,
    addPayment,
    addMyPayment,
    editPayment,
    removePayment
} from "../controllers/paymentController.js";

import { validatePayment } from "../middleware/validatePayment.js";
import { validateMemberPayment } from "../middleware/validateMemberPayment.js";
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

// GET PAYMENTS OF A MEMBERSHIP (member allowed - ownership is
// enforced in the service since this is keyed by membership, not user)
router.get(
    "/membership/:id_membership",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "member"),
    fetchPaymentsByMembership
);

// GET INVOICE/RECEIPT DATA FOR ONE PAYMENT (member allowed - ownership
// is enforced in the service; must be registered before /:id so
// "invoice" isn't swallowed as an id param)
router.get(
    "/invoice/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "member"),
    fetchInvoice
);

// Same data, alternate path (/:id/receipt) - kept as an alias to the
// exact same controller/service rather than a second implementation,
// so a payment receipt can be fetched either way with identical
// authorization and content.
router.get(
    "/:id/receipt",
    authenticateToken,
    authorizeRoles("admin", "receptionist", "member"),
    fetchInvoice
);

// GET PAYMENT BY ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchPaymentById
);

// CREATE PAYMENT (member self-service - cash only, always approved
// instantly)
router.post(
    "/me",
    authenticateToken,
    authorizeRoles("member"),
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
