import db from "../config/database.js";

export const getAllEquipments = async () => {

    const sql = `
        SELECT *
        FROM equipment
        ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

export const getEquipmentById = async (id) => {

    const sql = `
        SELECT *
        FROM equipment
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

export const createEquipment = async (equipmentData) => {

    const sql = `
        INSERT INTO equipment
        (maint_date, state)
        VALUES (?, ?)
    `;

    const values = [
        equipmentData.maint_date,
        equipmentData.state
    ];

    const [result] = await db.query(sql, values);

    return result;
};

export const updateEquipment = async (id, equipmentData) => {

    const sql = `
        UPDATE equipment
        SET
            maint_date = ?,
            state = ?
        WHERE id = ?
    `;

    const values = [
        equipmentData.maint_date,
        equipmentData.state,
        id
    ];

    const [result] = await db.query(sql, values);

    return result;
};

export const deleteEquipment = async (id) => {

    const sql = `
        DELETE FROM equipment
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};