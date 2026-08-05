import db from "../config/database.js";

// GET ALL MEMBERSHIPS
export const getAllMemberships = async () => {

    const sql = `
        SELECT
            id,
            id_user,
            name,
            duration,
            price,
            start_date,
            end_date,
            state,
            duration_promo,
            type
        FROM membership
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET MEMBERSHIP BY ID
export const getMembershipById = async (id) => {

    const sql = `
        SELECT
            id,
            id_user,
            name,
            duration,
            price,
            start_date,
            end_date,
            state,
            duration_promo,
            type
        FROM membership
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// CREATE MEMBERSHIP
export const createMembership = async (data) => {

    const sql = `
        INSERT INTO membership
        (
            id_user,
            name,
            duration,
            price,
            start_date,
            end_date,
            state,
            duration_promo,
            type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        data.id_user,
        data.name,
        data.duration,
        data.price,
        data.start_date,
        data.end_date,
        data.state,
        data.duration_promo,
        data.type
    ]);

    return result;
};

// GET ACTIVE MEMBERSHIP
export const getActiveMembershipByUserId = async (id_user) => {

    const sql = `
        SELECT
            id,
            id_user,
            name,
            duration,
            price,
            start_date,
            end_date,
            state,
            duration_promo,
            type
        FROM membership
        WHERE id_user = ?
        AND state = 'active'
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
};

// UPDATE EXPIRED MEMBERSHIPS
export const updateExpiredMemberships = async () => {

    const sql = `
        UPDATE membership
        SET state = 'expired'
        WHERE end_date < CURDATE()
        AND state = 'active'
    `;

    const [result] = await db.query(sql);

    return result;
};