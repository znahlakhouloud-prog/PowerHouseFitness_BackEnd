import {
    getAllPayments,
    getPaymentById,
    getPaymentsByMembership,
    createPayment,
    updatePayment,
    deletePayment,
    getTotalPaidByMembership
} from "../models/payment.js";

import {
    getMembershipById
} from "../models/membership.js";


// GET ALL PAYMENTS
export const fetchPaymentsService = async () => {

    return await getAllPayments();

};

// GET PAYMENT BY ID
export const fetchPaymentByIdService = async (id) => {

    const payments = await getPaymentById(id);

    if (payments.length === 0) {

        const error = new Error("Payment not found");
        error.status = 404;
        throw error;

    }

    return payments[0];

};

// GET PAYMENTS BY MEMBERSHIP
// `requester` is only checked for a "member" caller - staff can
// view any membership's payments, a member only their own.
export const fetchPaymentsByMembershipService = async (
    id_membership,
    requester
) => {

    if (requester?.role === "member") {

        const memberships = await getMembershipById(id_membership);

        if (
            memberships.length === 0 ||
            memberships[0].id_user !== requester.id
        ) {

            const error = new Error("Access denied");
            error.status = 403;
            throw error;

        }

    }

    return await getPaymentsByMembership(id_membership);

};

// CREATE PAYMENT (admin/receptionist - always treated as confirmed)
export const createPaymentService = async (data) => {

    // Check membership exists
    const memberships = await getMembershipById(data.id_membership);

    if (memberships.length === 0) {

        const error = new Error("Membership not found");
        error.status = 404;
        throw error;

    }

    const membership = memberships[0];

    // Remaining amount
    const totalPaid =
        await getTotalPaidByMembership(data.id_membership);

    const remaining =
        membership.price - totalPaid;

    if (remaining <= 0) {

        const error = new Error("Membership already fully paid");
        error.status = 409;
        throw error;

    }

    if (Number(data.amount) > remaining) {

        const error = new Error(
            `Payment exceeds remaining balance (${remaining})`
        );

        error.status = 409;
        throw error;

    }

    const paymentData = {

        id_membership: data.id_membership,
        p_date: data.p_date,
        amount: Number(data.amount),
        type: data.type,
        rest: remaining - Number(data.amount),
        status: "approved",
        receipt_file: null

    };

    return await createPayment(paymentData);

};

// CREATE PAYMENT (member self-service) - card is mock-approved
// instantly, bank transfer goes in as pending until reviewed.
export const createMemberPaymentService = async (id_user, data, file) => {

    const memberships = await getMembershipById(data.id_membership);

    if (memberships.length === 0) {

        const error = new Error("Membership not found");
        error.status = 404;
        throw error;

    }

    const membership = memberships[0];

    if (membership.id_user !== Number(id_user)) {

        const error = new Error("Access denied");
        error.status = 403;
        throw error;

    }

    const totalPaid =
        await getTotalPaidByMembership(data.id_membership);

    const remaining =
        membership.price - totalPaid;

    if (remaining <= 0) {

        const error = new Error("Membership already fully paid");
        error.status = 409;
        throw error;

    }

    if (Number(data.amount) > remaining) {

        const error = new Error(
            `Payment exceeds remaining balance (${remaining})`
        );

        error.status = 409;
        throw error;

    }

    const paymentData = {

        id_membership: data.id_membership,
        p_date: new Date().toISOString().split("T")[0],
        amount: Number(data.amount),
        type: data.type,
        rest: remaining - Number(data.amount),
        status: data.type === "transfer" ? "pending" : "approved",
        receipt_file: file ? file.filename : null

    };

    return await createPayment(paymentData);

};

// UPDATE PAYMENT
export const updatePaymentService = async (id, data) => {

    const payments = await getPaymentById(id);

    if (payments.length === 0) {

        const error = new Error("Payment not found");
        error.status = 404;
        throw error;

    }

    const currentPayment = payments[0];

    const memberships =
        await getMembershipById(data.id_membership);

    if (memberships.length === 0) {

        const error = new Error("Membership not found");
        error.status = 404;
        throw error;

    }

    const membership = memberships[0];

    const totalPaid =
        await getTotalPaidByMembership(data.id_membership);

    let totalWithoutCurrent = totalPaid;

    if (
        currentPayment.id_membership ===
        data.id_membership
    ) {

        totalWithoutCurrent =
            totalPaid - currentPayment.amount;

    }

    const remaining =
        membership.price - totalWithoutCurrent;

    if (Number(data.amount) > remaining) {

        const error = new Error(
            `Payment exceeds remaining balance (${remaining})`
        );

        error.status = 409;
        throw error;

    }

    const paymentData = {

        id_membership: data.id_membership,
        p_date: data.p_date,
        amount: Number(data.amount),
        type: data.type,
        rest: remaining - Number(data.amount),
        // An admin/receptionist edit is always treated as confirmed -
        // this also doubles as the only way today to manually approve
        // a member-submitted pending transfer, since no review UI
        // exists yet.
        status: "approved"

    };

    return await updatePayment(id, paymentData);

};

// DELETE PAYMENT
export const deletePaymentService = async (id) => {

    const payments = await getPaymentById(id);

    if (payments.length === 0) {

        const error = new Error("Payment not found");
        error.status = 404;
        throw error;

    }

    return await deletePayment(id);

};