import { createPayment, getPaymentById, getTotalPaidByMembership, updatePayment } from "../models/payment.js";
import { getMembershipById } from "../models/membership.js";

export const createPaymentService = async (data) => {

    const membership = await getMembershipById(data.id_membership);

    if (membership.length === 0) {
        const error = new Error("Membership not found");
        error.status = 404;
        throw error;
    }

    const membershipData = membership[0];

    if (membershipData.state === "expired") {
        const error = new Error("Membership is expired");
        error.status = 409;
        throw error;
    }

    const totalPaid = await getTotalPaidByMembership(data.id_membership);

    const remaining = membershipData.price - totalPaid;

    if (remaining <= 0) {
        const error = new Error("Membership already fully paid");
        error.status = 409;
        throw error;
    }

    if (data.amount > remaining) {
        const error = new Error(`Payment exceeds remaining balance (${remaining})`);
        error.status = 409;
        throw error;
    }

    const paymentData = {
        ...data,
        rest: remaining - data.amount
    };

    return await createPayment(paymentData);
};

export const updatePaymentService = async (id, data) => {
    const payments = await getPaymentById(id);

    if (payments.length === 0) {
        const error = new Error("Payment not found");
        error.status = 404;
        throw error;
    }

    const membership = await getMembershipById(data.id_membership);

    if (membership.length === 0) {
        const error = new Error("Membership not found");
        error.status = 404;
        throw error;
    }

    const membershipData = membership[0];
    const totalPaid = await getTotalPaidByMembership(data.id_membership);
    const totalExcludingCurrent = data.id_membership === payments[0].id_membership
        ? totalPaid - payments[0].amount
        : totalPaid;
    const remaining = membershipData.price - totalExcludingCurrent;

    if (data.amount > remaining) {
        const error = new Error(`Payment exceeds remaining balance (${remaining})`);
        error.status = 409;
        throw error;
    }

    return updatePayment(id, { ...data, rest: remaining - data.amount });
};
