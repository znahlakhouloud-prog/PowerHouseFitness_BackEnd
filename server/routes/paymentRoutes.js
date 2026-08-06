import express from "express";

import {
    fetchPayments,
    fetchPaymentById,
    fetchPaymentsByMembership,
    addPayment,
    editPayment,
    removePayment
} from "../controllers/paymentController.js";

import { validatePayment } from "../middleware/validatePayment.js";
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

// GET PAYMENTS OF A MEMBERSHIP
router.get(
    "/membership/:id_membership",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchPaymentsByMembership
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