import db from "../config/database.js";

// CREATE EQUIPMENT REPORT
export const createEquipmentReport = async (data) => {

    const sql = `
        INSERT INTO equipment_report
        (
            id_user,
            equipment_name,
            description,
            status
        )
        VALUES (?, ?, ?, 'pending')
    `;

    const values = [
        data.id_user,
        data.equipment_name,
        data.description ?? null
    ];

    const [result] = await db.query(sql, values);

    return result;
};

// GET EQUIPMENT REPORTS FOR ONE USER
export const getEquipmentReportsByUser = async (id_user) => {

    const sql = `
        SELECT
            id,
            id_user,
            equipment_name,
            description,
            status,
            created_at
        FROM equipment_report
        WHERE id_user = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
};
