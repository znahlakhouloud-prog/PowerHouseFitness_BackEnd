import db from "../config/database.js";

// GET ALL COACHES
export const getAllCoaches = async () => {

    const sql = `
        SELECT
            c.id,
            c.id_user,
            c.state,
            c.nbr_hr,
            u.user_name,
            u.email
        FROM coach c
        JOIN user u
            ON c.id_user = u.id
        ORDER BY c.id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET COACH BY ID
export const getCoachById = async (id) => {

    const sql = `
        SELECT
            c.id,
            c.id_user,
            c.state,
            c.nbr_hr,
            u.user_name,
            u.email
        FROM coach c
        JOIN user u
            ON c.id_user = u.id
        WHERE c.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// GET COACH BY USER ID
export const getCoachByUserId = async (id_user) => {

    const sql = `
        SELECT
            id,
            id_user,
            state,
            nbr_hr
        FROM coach
        WHERE id_user = ?
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
};

// CREATE COACH
export const createCoach = async (coachData) => {

    const sql = `
        INSERT INTO coach
        (
            id_user,
            state,
            nbr_hr
        )
        VALUES (?, ?, ?)
    `;

    const values = [
        coachData.id_user,
        coachData.state,
        coachData.nbr_hr
    ];

    const [result] = await db.query(sql, values);

    return result;
};

// UPDATE COACH
export const updateCoach = async (id, coachData) => {

    const sql = `
        UPDATE coach
        SET
            state = ?,
            nbr_hr = ?
        WHERE id = ?
    `;

    const values = [
        coachData.state,
        coachData.nbr_hr,
        id
    ];

    const [result] = await db.query(sql, values);

    return result;
};

// DELETE COACH
export const deleteCoach = async (id) => {

    const sql = `
        DELETE FROM coach
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};