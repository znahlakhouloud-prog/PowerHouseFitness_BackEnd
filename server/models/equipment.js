import db from "../config/database.js";

// GET ALL EQUIPMENTS
export const getAllEquipments = async () => {

    const sql = `
        SELECT
            id,
            maint_date,
            state
        FROM equipment
        ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET EQUIPMENT BY ID
export const getEquipmentById = async (id) => {

    const sql = `
        SELECT
            id,
            maint_date,
            state
        FROM equipment
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// CREATE EQUIPMENT
export const createEquipment = async (equipmentData) => {

    const sql = `
        INSERT INTO equipment
        (
            maint_date,
            state
        )
        VALUES (?, ?)
    `;

    const values = [
        equipmentData.maint_date,
        equipmentData.state
    ];

    const [result] = await db.query(sql, values);

    return result;
};

// UPDATE EQUIPMENT
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

// DELETE EQUIPMENT
export const deleteEquipment = async (id) => {

    const sql = `
        DELETE FROM equipment
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};