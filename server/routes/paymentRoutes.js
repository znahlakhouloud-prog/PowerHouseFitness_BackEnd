import express from "express";

import {
    fetchPayments,
    fetchPaymentById,
    fetchPaymentsByMembership,
    addPayment } from "../controllers/paymentController.js";
import { validatePayment } from "../middleware/validatePayment.js";

const router = express.Router();

router.get("/", fetchPayments);

router.get("/membership/:id_membership", fetchPaymentsByMembership);

router.get("/:id", fetchPaymentById);

router.post("/",validatePayment, addPayment);

export default router;




