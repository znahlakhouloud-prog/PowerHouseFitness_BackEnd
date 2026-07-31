import db from "../config/database.js";

export const getAllCoaches = async () => {

    const sql = `
        SELECT
            c.*,
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

export const getCoachById = async (id) => {

    const sql = `
        SELECT
            c.*,
            u.user_name,
            u.email
        FROM coach c
        JOIN user u
            ON c.id_user = u.id
        WHERE c.id = ?
    `;

    const [rows] = await db.query(sql,[id]);

    return rows;
};

export const getCoachByUserId = async (id_user) => {

    const sql = `
        SELECT *
        FROM coach
        WHERE id_user = ?
    `;

    const [rows] = await db.query(sql,[id_user]);

    return rows;
};

export const createCoach = async (coachData) => {

    const sql = `
        INSERT INTO coach
        (id_user,state,nbr_hr)
        VALUES (?,?,?)
    `;

    const values = [
        coachData.id_user,
        coachData.state,
        coachData.nbr_hr
    ];

    const [result] = await db.query(sql,values);

    return result;
};

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

    const [result] = await db.query(sql,values);

    return result;
};

export const deleteCoach = async (id) => {

    const sql = `
        DELETE FROM coach
        WHERE id = ?
    `;

    const [result] = await db.query(sql,[id]);

    return result;
};