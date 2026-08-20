import {
    getAllPayments,
    getPaymentById,
    getPaymentsByMembership,
    getInvoiceDataById,
    createPayment,
    updatePayment,
    deletePayment,
    getTotalPaidByMembership
} from "../models/payment.js";

import {
    getMembershipById
} from "../models/membership.js";

import { getUserById } from "../models/user.js";
import { notifyAdmins } from "./notificationService.js";

// Cash is the only payment method the application accepts for new
// payments - card and bank transfer have been removed entirely, so
// every payment created from here on is unconditionally "cash" with
// no card_brand/transaction_reference/receipt, regardless of what a
// caller might send. This is never read from the request body, so it
// can't be spoofed into anything else.
const NEW_PAYMENT_FIELDS = {
    type: "cash",
    card_brand: null,
    transaction_reference: null,
    receipt_file: null
};

// Non-fatal - a payment must still succeed even if the notification
// fails for some reason
const notifyAdminsOfPayment = async (id_user, amount, status) => {

    try {

        const users = await getUserById(id_user);
        const userName = users[0]?.user_name || "A member";

        await notifyAdmins({
            title: status === "approved" ? "Payment Received" : "Payment Pending",
            descrip: `${userName} - ${Number(amount).toLocaleString()} DA (${status})`,
            type: "payment"
        });

    } catch (notifyError) {

        console.error("NOTIFY ADMINS ERROR (payment):", notifyError);

    }

};


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

// GET INVOICE DATA FOR ONE PAYMENT (member allowed - ownership is
// enforced the same way as fetchPaymentsByMembershipService, since a
// member should only ever be able to print their own invoices)
export const fetchInvoiceDataService = async (id, requester) => {

    const rows = await getInvoiceDataById(id);

    if (rows.length === 0) {

        const error = new Error("Payment not found");
        error.status = 404;
        throw error;

    }

    const invoice = rows[0];

    if (
        requester?.role === "member" &&
        invoice.id_user !== requester.id
    ) {

        const error = new Error("Access denied");
        error.status = 403;
        throw error;

    }

    // Invoice number is derived from the real payment id, generated
    // here on the backend - never a frontend-side random value, and
    // stable/unique since it's built from the payment's own primary
    // key. Format: PF-<year of payment>-<payment id, zero-padded>.
    const year = new Date(invoice.p_date).getFullYear();

    const invoiceNumber =
        `PF-${year}-${String(invoice.payment_id).padStart(6, "0")}`;

    return {
        invoiceNumber,
        payment: {
            id: invoice.payment_id,
            p_date: invoice.p_date,
            amount: invoice.amount,
            type: invoice.type,
            card_brand: invoice.card_brand,
            transaction_reference: invoice.transaction_reference,
            rest: invoice.rest,
            status: invoice.status
        },
        membership: {
            id: invoice.membership_id,
            name: invoice.membership_name,
            type: invoice.membership_type,
            duration: invoice.duration,
            price: invoice.membership_price,
            start_date: invoice.start_date,
            end_date: invoice.end_date
        },
        member: {
            id: invoice.id_user,
            user_name: invoice.user_name,
            email: invoice.email
        }
    };

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
        ...NEW_PAYMENT_FIELDS,
        rest: remaining - Number(data.amount),
        status: "approved"

    };

    const result = await createPayment(paymentData);

    await notifyAdminsOfPayment(membership.id_user, paymentData.amount, paymentData.status);

    return result;

};

// CREATE PAYMENT (member self-service) - cash only, always approved
// instantly (there is no pending state left to reach now that the
// only pending-eligible method, bank transfer, has been removed).
export const createMemberPaymentService = async (id_user, data) => {

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
        ...NEW_PAYMENT_FIELDS,
        rest: remaining - Number(data.amount),
        status: "approved"

    };

    const result = await createPayment(paymentData);

    await notifyAdminsOfPayment(id_user, paymentData.amount, paymentData.status);

    return result;

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
        // The payment method is never editable, even for staff - an
        // edit here can only correct the amount/date/membership of an
        // existing record. Whatever this row's real historical method
        // was (cash, or a legacy card/transfer payment from before
        // those were removed) is preserved exactly as-is, so editing a
        // payment can never rewrite payment-method history.
        type: currentPayment.type,
        card_brand: currentPayment.card_brand,
        transaction_reference: currentPayment.transaction_reference,
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
