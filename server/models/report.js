import db from "../config/database.js";

//    GET ALL REPORTS
export const getAllReports = async () => {

    const sql = `
        SELECT
            id,
            created_at,
            income,
            nbr_new_member,
            nbr_expired_membership,
            top_membership,
            nbr_attendance
        FROM report
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;

};

//    GET REPORT BY ID
export const getReportById = async (id) => {

    const sql = `
        SELECT
            id,
            created_at,
            income,
            nbr_new_member,
            nbr_expired_membership,
            top_membership,
            nbr_attendance
        FROM report
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;

};

//    CREATE REPORT
export const createReport = async (reportData) => {

    const sql = `
        INSERT INTO report
        (
            income,
            nbr_new_member,
            nbr_expired_membership,
            top_membership,
            nbr_attendance
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [

        reportData.income,
        reportData.nbr_new_member,
        reportData.nbr_expired_membership,
        reportData.top_membership,
        reportData.nbr_attendance

    ];

    const [result] = await db.query(sql, values);

    return result;

};

//    DELETE REPORT
export const deleteReport = async (id) => {

    const sql = `
        DELETE FROM report
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;

};

//    TOTAL INCOME
export const getTotalIncome = async () => {

    const sql = `
        SELECT
            COALESCE(SUM(amount), 0) AS income
        FROM payment
    `;

    const [rows] = await db.query(sql);

    return rows[0].income;

};

//    NEW MEMBERS TODAY
export const getNewMembers = async () => {

    const sql = `
        SELECT
            COUNT(*) AS total
        FROM membership
        WHERE start_date = CURDATE()
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    EXPIRED MEMBERSHIPS
export const getExpiredMemberships = async () => {

    const sql = `
        SELECT
            COUNT(*) AS total
        FROM membership
        WHERE state = 'expired'
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    MOST POPULAR MEMBERSHIP
export const getTopMembership = async () => {

    const sql = `
        SELECT
            name,
            COUNT(*) AS total
        FROM membership
        GROUP BY name
        ORDER BY total DESC
        LIMIT 1
    `;

    const [rows] = await db.query(sql);

    return rows.length > 0
        ? rows[0].name
        : null;

};

//    MONTHLY ATTENDANCE
export const getAttendanceCount = async () => {

    const sql = `
        SELECT
            COUNT(*) AS total
        FROM attendance
        WHERE MONTH(attendance_date) = MONTH(CURDATE())
        AND YEAR(attendance_date) = YEAR(CURDATE())
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};