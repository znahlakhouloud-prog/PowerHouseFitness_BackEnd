import {
    getAllPayments,
    getPaymentById,
    getPaymentsByMembership,
    createPayment
} from "../models/payment.js";
import { createPaymentService } from "../services/paymentServices.js";


export const fetchPayments = async (req, res) => {
     try {

        const payments = await getAllPayments();

        res.json(payments);

    } catch (error) {

        res.status(500).json(error);

    }
};

export const fetchPaymentById = async (req, res) => {
     try {

        const payments = await getPaymentById(req.params.id);

        if (payments.length === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json(payments[0]);

    } catch (error) {

        res.status(500).json(error);

    }
};

export const fetchPaymentsByMembership = async (req, res) => {
    try {

        const payments =
            await getPaymentsByMembership(req.params.id_membership);

        res.json(payments);

    } catch (error) {

        res.status(500).json(error);

    }
};

export const addPayment = async (req, res) => {
    try {

        const result = await createPaymentService(req.body);

        res.status(201).json({
            message: "Payment created successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }
};