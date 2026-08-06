import db from "../config/database.js";

// GET ALL ATTENDANCES
export const getAllAttendances = async () => {

    const sql = `
        SELECT
            a.id,
            a.id_user,
            a.attendance_date,
            a.check_in,
            u.user_name
        FROM attendance a
        JOIN user u
            ON a.id_user = u.id
        ORDER BY a.check_in DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

// GET ATTENDANCE BY ID
export const getAttendanceById = async (id) => {

    const sql = `
        SELECT
            id,
            id_user,
            attendance_date,
            check_in
        FROM attendance
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// GET TODAY'S ATTENDANCE
export const getAttendanceToday = async (id_user) => {

    const sql = `
        SELECT
            id,
            id_user,
            attendance_date,
            check_in
        FROM attendance
        WHERE id_user = ?
        AND attendance_date = CURDATE()
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
};

// CREATE ATTENDANCE
export const createAttendance = async (attendanceData) => {

    const sql = `
        INSERT INTO attendance
        (
            id_user,
            attendance_date,
            check_in
        )
        VALUES (?, ?, ?)
    `;

    const values = [
        attendanceData.id_user,
        attendanceData.attendance_date,
        attendanceData.check_in
    ];

    const [result] = await db.query(sql, values);

    return result;
};