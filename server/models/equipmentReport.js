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

// GET ALL EQUIPMENT REPORTS (admin/receptionist review list)
export const getAllEquipmentReports = async () => {

    const sql = `
        SELECT
            er.id,
            er.id_user,
            er.equipment_name,
            er.description,
            er.status,
            er.created_at,
            u.user_name AS reported_by,
            u.role AS reported_by_role
        FROM equipment_report er
        JOIN user u ON er.id_user = u.id
        ORDER BY er.created_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
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
