import db from "../config/database.js";

export const getAllPayments = async () => {

    const sql = `
       SELECT
            p.*,
            u.user_name,
            m.name AS membership_name
       FROM payment p
       JOIN membership m ON p.id_membership = m.id
       JOIN user u ON m.id_user = u.id
       ORDER BY p.id DESC;
    `;

    const [rows] = await db.query(sql);

    return rows;
};

export const getPaymentById = async (id) => {

    const sql = `
       SELECT
            p.*,
            u.user_name,
            m.name AS membership_name
       FROM payment p
       JOIN membership m ON p.id_membership = m.id
       JOIN user u ON m.id_user = u.id
       WHERE p.id = ?
       ORDER BY p.id DESC;
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

export const getPaymentsByMembership = async (id_membership) => {

    const sql = `
       SELECT
            p.*,
            u.user_name,
            m.name AS membership_name
       FROM payment p
       JOIN membership m ON p.id_membership = m.id
       JOIN user u ON m.id_user = u.id
       WHERE p.id_membership = ?
       ORDER BY p.id DESC;
    `;

    const [rows] = await db.query(sql, [id_membership]);

    return rows;
};

export const createPayment = async (paymentData) => {

    const sql = `
        INSERT INTO payment
        (id_membership, p_date, amount, type, rest)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        paymentData.id_membership,
        paymentData.p_date,
        paymentData.amount,
        paymentData.type,
        paymentData.rest
    ];

    const [result] = await db.query(sql, values);

    return result;
};

export const getTotalPaidByMembership = async (id_membership) => {

    const sql = `
        SELECT COALESCE(SUM(amount), 0) AS total_paid
        FROM payment
        WHERE id_membership = ?
    `;

    const [rows] = await db.query(sql, [id_membership]);

    return rows[0].total_paid;
};

export const updatePayment = async (id, paymentData) => {

    const sql = `
        UPDATE payment
        SET
            id_membership = ?,
            p_date = ?,
            amount = ?,
            type = ?,
            rest = ?
        WHERE id = ?
    `;

    const values = [
        paymentData.id_membership,
        paymentData.p_date,
        paymentData.amount,
        paymentData.type,
        paymentData.rest,
        id
    ];

    const [result] = await db.query(sql, values);

    return result;
};

export const deletePayment = async (id) => {

    const sql = `
        DELETE FROM payment
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};



