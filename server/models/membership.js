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
// `conn` defaults to the pool so every existing call site keeps
// working unchanged; a transactional caller passes its own
// connection so this insert becomes part of that transaction.
export const createMembership = async (data, conn = db) => {

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

    const [result] = await conn.query(sql, [
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

// UPDATE MEMBERSHIP
export const updateMembership = async (id, data) => {

    const sql = `
        UPDATE membership
        SET
            name = ?,
            duration = ?,
            price = ?,
            start_date = ?,
            end_date = ?,
            duration_promo = ?,
            type = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        data.name,
        data.duration,
        data.price,
        data.start_date,
        data.end_date,
        data.duration_promo,
        data.type,
        id
    ]);

    return result;
};

// GET ALL MEMBERSHIPS FOR ONE USER (every state - active and expired -
// ordered oldest first, so a caller can distinguish the current one
// from past seasons and never has to guess which row is "current")
export const getMembershipsByUserId = async (id_user) => {

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
        ORDER BY start_date ASC, id ASC
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
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

// UPDATE EXPIRED MEMBERSHIPS - returns the rows that just transitioned
// (with user_name) so the caller can notify about them exactly once,
// not the raw UPDATE result which none of the existing callers use
export const updateExpiredMemberships = async () => {

    const selectSql = `
        SELECT
            m.id,
            m.id_user,
            m.name,
            m.price,
            u.user_name
        FROM membership m
        JOIN user u ON m.id_user = u.id
        WHERE m.end_date < CURDATE()
        AND m.state = 'active'
    `;

    const [newlyExpired] = await db.query(selectSql);

    if (newlyExpired.length > 0) {

        const updateSql = `
            UPDATE membership
            SET state = 'expired'
            WHERE end_date < CURDATE()
            AND state = 'active'
        `;

        await db.query(updateSql);

    }

    return newlyExpired;
};