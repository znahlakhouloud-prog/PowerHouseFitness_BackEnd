import db from "../config/database.js";

// GET ALL PAYMENTS
export const getAllPayments = async () => {

    const sql = `
        SELECT
            p.id,
            p.id_membership,
            p.p_date,
            p.amount,
            p.type,
            p.card_brand,
            p.transaction_reference,
            p.rest,
            p.status,
            p.receipt_file,
            u.user_name,
            m.name AS membership_name
        FROM payment p
        JOIN membership m
            ON p.id_membership = m.id
        JOIN user u
            ON m.id_user = u.id
        ORDER BY p.id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET PAYMENT BY ID
export const getPaymentById = async (id) => {

    const sql = `
        SELECT
            p.id,
            p.id_membership,
            p.p_date,
            p.amount,
            p.type,
            p.card_brand,
            p.transaction_reference,
            p.rest,
            p.status,
            p.receipt_file,
            u.user_name,
            m.name AS membership_name
        FROM payment p
        JOIN membership m
            ON p.id_membership = m.id
        JOIN user u
            ON m.id_user = u.id
        WHERE p.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// GET PAYMENTS BY MEMBERSHIP
export const getPaymentsByMembership = async (id_membership) => {

    const sql = `
        SELECT
            p.id,
            p.id_membership,
            p.p_date,
            p.amount,
            p.type,
            p.card_brand,
            p.transaction_reference,
            p.rest,
            p.status,
            p.receipt_file,
            u.user_name,
            m.name AS membership_name
        FROM payment p
        JOIN membership m
            ON p.id_membership = m.id
        JOIN user u
            ON m.id_user = u.id
        WHERE p.id_membership = ?
        ORDER BY p.p_date ASC, p.id ASC
    `;

    const [rows] = await db.query(sql, [id_membership]);

    return rows;
};

// GET ONE PAYMENT'S FULL INVOICE DATA (payment + membership + payer -
// only safe, non-authentication fields are selected here; password,
// reset tokens etc. are never part of this query)
export const getInvoiceDataById = async (id) => {

    const sql = `
        SELECT
            p.id AS payment_id,
            p.p_date,
            p.amount,
            p.type,
            p.card_brand,
            p.transaction_reference,
            p.rest,
            p.status,
            m.id AS membership_id,
            m.id_user,
            m.name AS membership_name,
            m.type AS membership_type,
            m.duration,
            m.price AS membership_price,
            m.start_date,
            m.end_date,
            u.user_name,
            u.email
        FROM payment p
        JOIN membership m
            ON p.id_membership = m.id
        JOIN user u
            ON m.id_user = u.id
        WHERE p.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// CREATE PAYMENT
// `conn` defaults to the pool so every existing call site keeps
// working unchanged; a transactional caller passes its own
// connection so this insert becomes part of that transaction.
export const createPayment = async (paymentData, conn = db) => {

    const sql = `
        INSERT INTO payment
        (
            id_membership,
            p_date,
            amount,
            type,
            card_brand,
            transaction_reference,
            rest,
            status,
            receipt_file
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        paymentData.id_membership,
        paymentData.p_date,
        paymentData.amount,
        paymentData.type,
        paymentData.card_brand ?? null,
        paymentData.transaction_reference ?? null,
        paymentData.rest,
        paymentData.status,
        paymentData.receipt_file ?? null
    ];

    const [result] = await conn.query(sql, values);

    return result;
};

// GET TOTAL PAID (only payments actually confirmed - a pending
// bank transfer must not reduce the balance until approved)
export const getTotalPaidByMembership = async (id_membership) => {

    const sql = `
        SELECT
            COALESCE(SUM(amount),0) AS total_paid
        FROM payment
        WHERE id_membership = ?
        AND status = 'approved'
    `;

    const [rows] = await db.query(sql, [id_membership]);

    return rows[0].total_paid;
};

// UPDATE PAYMENT
export const updatePayment = async (id, paymentData) => {

    const sql = `
        UPDATE payment
        SET
            id_membership = ?,
            p_date = ?,
            amount = ?,
            type = ?,
            card_brand = ?,
            transaction_reference = ?,
            rest = ?,
            status = ?
        WHERE id = ?
    `;

    const values = [
        paymentData.id_membership,
        paymentData.p_date,
        paymentData.amount,
        paymentData.type,
        paymentData.card_brand ?? null,
        paymentData.transaction_reference ?? null,
        paymentData.rest,
        paymentData.status,
        id
    ];

    const [result] = await db.query(sql, values);

    return result;
};

// DELETE PAYMENT
export const deletePayment = async (id) => {

    const sql = `
        DELETE FROM payment
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};

// PAYMENT HISTORY
export const getPaymentHistoryByMembership = async (id_membership) => {

    const sql = `
        SELECT
            id,
            amount,
            p_date,
            rest
        FROM payment
        WHERE id_membership = ?
        ORDER BY p_date ASC, id ASC
    `;

    const [rows] = await db.query(sql, [id_membership]);

    return rows;
};
