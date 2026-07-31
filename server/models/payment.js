import db from "../config/database.js";

export const getAllPayments = async () => {

    const sql = `
        SELECT *
        FROM payment
        ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

export const getPaymentById = async (id) => {

    const sql = `
        SELECT *
        FROM payment
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

export const getPaymentsByMembership = async (id_membership) => {

    const sql = `
        SELECT *
        FROM payment
        WHERE id_membership = ?
        ORDER BY p_date DESC
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




