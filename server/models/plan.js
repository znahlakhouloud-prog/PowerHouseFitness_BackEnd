import db from "../config/database.js";

// GET ALL PLAN ROWS (flat — one row per session/price option)
export const getAllPlanRows = async () => {

    const sql = `
        SELECT
            id,
            name,
            type,
            duration_days,
            nbr_sessions,
            price
        FROM plan
        ORDER BY id
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET A SINGLE PLAN ROW BY ID
export const getPlanRowById = async (id) => {

    const sql = `
        SELECT
            id,
            name,
            type,
            duration_days,
            nbr_sessions,
            price
        FROM plan
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// INSERT ONE PLAN ROW (one session/price option)
export const insertPlanRow = async (data) => {

    const sql = `
        INSERT INTO plan
        (name, type, duration_days, nbr_sessions, price)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        data.name,
        data.type,
        data.duration_days,
        data.nbr_sessions,
        data.price
    ]);

    return result;
};

// DELETE ALL ROWS BELONGING TO ONE PLAN (matched by name + type)
export const deletePlanRowsByNameType = async (name, type) => {

    const sql = `
        DELETE FROM plan
        WHERE name = ? AND type = ?
    `;

    const [result] = await db.query(sql, [name, type]);

    return result;
};
