import {

    fetchPaymentsService,
    fetchPaymentByIdService,
    fetchPaymentsByMembershipService,
    createPaymentService,
    createMemberPaymentService,
    updatePaymentService,
    deletePaymentService

} from "../services/paymentServices.js";

// GET ALL PAYMENTS
export const fetchPayments = async (req, res) => {

    try {

        const payments = await fetchPaymentsService();

        res.json(payments);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET PAYMENT BY ID
export const fetchPaymentById = async (req, res) => {

    try {

        const payment =
            await fetchPaymentByIdService(req.params.id);

        res.json(payment);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET PAYMENTS BY MEMBERSHIP
export const fetchPaymentsByMembership = async (req, res) => {

    try {

        const payments =
            await fetchPaymentsByMembershipService(
                req.params.id_membership,
                req.user
            );

        res.json(payments);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE PAYMENT (member self-service)
export const addMyPayment = async (req, res) => {

    try {

        const result = await createMemberPaymentService(
            req.user.id,
            req.body,
            req.file
        );

        res.status(201).json({

            message: "Payment submitted successfully",
            id: result.insertId

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE PAYMENT
export const addPayment = async (req, res) => {

    try {

        const result =
            await createPaymentService(req.body);

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

// UPDATE PAYMENT
export const editPayment = async (req, res) => {

    try {

        await updatePaymentService(
            req.params.id,
            req.body
        );

        res.json({

            message: "Payment updated successfully"

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// DELETE PAYMENT
export const removePayment = async (req, res) => {

    try {

        await deletePaymentService(req.params.id);

        res.json({

            message: "Payment deleted successfully"

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};