import db from "../config/database.js";

export const getAllReports = async () => {

    const sql = `
        SELECT *
        FROM report
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

export const getReportById = async (id) => {

    const sql = `
        SELECT *
        FROM report
        WHERE id = ?
    `;

    const [rows] = await db.query(sql,[id]);

    return rows;
};

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
        VALUES (?,?,?,?,?)
    `;

    const values = [

        reportData.income,
        reportData.nbr_new_member,
        reportData.nbr_expired_membership,
        reportData.top_membership,
        reportData.nbr_attendance

    ];

    const [result] = await db.query(sql,values);

    return result;
};

export const deleteReport = async (id)=>{

    const sql = `
        DELETE FROM report
        WHERE id=?
    `;

    const [result]=await db.query(sql,[id]);

    return result;
};

export const getTotalIncome = async () => {

    const sql = `
        SELECT IFNULL(SUM(amount),0) AS income
        FROM payment
    `;

    const [rows] = await db.query(sql);

    return rows[0].income;
};

export const getNewMembers = async () => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM membership
        WHERE start_date = CURDATE()
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;
};

export const getExpiredMemberships = async () => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM membership
        WHERE state='expired'
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;
};

export const getTopMembership = async () => {

    const sql = `
        SELECT name
        FROM membership
        GROUP BY name
        ORDER BY COUNT(*) DESC
        LIMIT 1
    `;

    const [rows] = await db.query(sql);

    return rows.length ? rows[0].name : "None";
};

export const getAttendanceCount = async () => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM attendance
        WHERE MONTH(attendance_date) = MONTH(CURDATE())
        AND YEAR(attendance_date) = YEAR(CURDATE())
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;
};