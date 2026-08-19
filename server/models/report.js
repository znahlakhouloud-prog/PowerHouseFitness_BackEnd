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

//    TOTAL INCOME (approved payments only - a pending bank
//    transfer hasn't been confirmed yet and must not count as revenue)
export const getTotalIncome = async () => {

    const sql = `
        SELECT
            COALESCE(SUM(amount), 0) AS income
        FROM payment
        WHERE status = 'approved'
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

//    ACTIVE MEMBERS (distinct members with an active membership)
export const getActiveMembersCount = async () => {

    const sql = `
        SELECT
            COUNT(DISTINCT id_user) AS total
        FROM membership
        WHERE state = 'active'
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    ATTENDANCE TODAY
export const getAttendanceToday = async () => {

    const sql = `
        SELECT
            COUNT(*) AS total
        FROM attendance
        WHERE attendance_date = CURDATE()
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    PENDING PAYMENTS (count and amount)
export const getPendingPaymentsCount = async () => {

    const sql = `
        SELECT
            COUNT(*) AS total
        FROM payment
        WHERE status = 'pending'
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    EQUIPMENT ISSUES (broken equipment + reports awaiting review)
export const getEquipmentIssuesCount = async () => {

    const sql = `
        SELECT
            (
                SELECT COUNT(*) FROM equipment WHERE state = 'broken'
            ) +
            (
                SELECT COUNT(*) FROM equipment_report WHERE status = 'pending'
            ) AS total
    `;

    const [rows] = await db.query(sql);

    return rows[0].total;

};

//    RECENT ACTIVITY (synthesized from existing tables - no
//    dedicated activity log exists). Each source is fetched
//    separately with its own real timestamp column; the cross-table
//    chronological merge happens in the service layer, since a
//    single SQL ORDER BY can't meaningfully compare independent
//    auto-increment ids across different tables.
export const getRecentRegistrations = async (limit = 15) => {

    const sql = `
        SELECT
            id,
            user_name,
            role,
            created_at
        FROM user
        ORDER BY created_at DESC, id DESC
        LIMIT ?
    `;

    const [rows] = await db.query(sql, [limit]);

    return rows;

};

export const getRecentPayments = async (limit = 15) => {

    const sql = `
        SELECT
            p.id,
            p.amount,
            p.status,
            p.p_date,
            u.user_name
        FROM payment p
        JOIN membership m ON p.id_membership = m.id
        JOIN user u ON m.id_user = u.id
        ORDER BY p.id DESC
        LIMIT ?
    `;

    const [rows] = await db.query(sql, [limit]);

    return rows;

};

export const getRecentExpiredMemberships = async (limit = 15) => {

    const sql = `
        SELECT
            m.id,
            m.name,
            m.end_date,
            u.user_name
        FROM membership m
        JOIN user u ON m.id_user = u.id
        WHERE m.state = 'expired'
        ORDER BY m.end_date DESC, m.id DESC
        LIMIT ?
    `;

    const [rows] = await db.query(sql, [limit]);

    return rows;

};

export const getRecentEquipmentReports = async (limit = 15) => {

    const sql = `
        SELECT
            er.id,
            er.equipment_name,
            er.created_at,
            u.user_name
        FROM equipment_report er
        JOIN user u ON er.id_user = u.id
        ORDER BY er.created_at DESC, er.id DESC
        LIMIT ?
    `;

    const [rows] = await db.query(sql, [limit]);

    return rows;

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

// =========================================
// PERIOD-AWARE TREND QUERIES
//
// period = "week"  -> last 7 days, grouped by day
// period = "month" -> current calendar month so far, grouped by day
// period = "year"  -> rolling last 12 months, grouped by month
//                     (this was the only behavior that existed
//                     before - kept as the default)
//
// `period` is always validated against this exact 3-value set
// before it reaches these functions (never raw user input), so
// branching on it in JS to pick the SQL shape is safe.
// =========================================

const PERIOD_CLAUSES = {

    week: {
        format: "%Y-%m-%d",
        range: "DATE_SUB(CURDATE(), INTERVAL 6 DAY)"
    },

    month: {
        format: "%Y-%m-%d",
        range: "DATE_FORMAT(CURDATE(), '%Y-%m-01')"
    },

    year: {
        format: "%Y-%m",
        range: "DATE_SUB(CURDATE(), INTERVAL 11 MONTH)"
    }

};

const getPeriodClause = (period) =>
    PERIOD_CLAUSES[period] || PERIOD_CLAUSES.year;

// =========================================
// INCOME OVER TIME
// =========================================

export const getIncomeTrend = async (period) => {

    const { format, range } = getPeriodClause(period);

    const sql = `
        SELECT
            DATE_FORMAT(p_date, ?) AS period_label,
            COALESCE(SUM(amount), 0) AS income
        FROM payment
        WHERE status = 'approved'
        AND p_date >= ${range}
        GROUP BY DATE_FORMAT(p_date, ?)
        ORDER BY period_label ASC
    `;

    const [rows] = await db.query(sql, [format, format]);

    return rows;
};

// =========================================
// ATTENDANCE OVER TIME
// =========================================

export const getAttendanceTrend = async (period) => {

    const { format, range } = getPeriodClause(period);

    const sql = `
        SELECT
            DATE_FORMAT(attendance_date, ?) AS period_label,
            COUNT(*) AS total
        FROM attendance
        WHERE attendance_date >= ${range}
        GROUP BY DATE_FORMAT(attendance_date, ?)
        ORDER BY period_label ASC
    `;

    const [rows] = await db.query(sql, [format, format]);

    return rows;
};

// =========================================
// NEW MEMBERS OVER TIME
// =========================================

export const getNewMembersTrend = async (period) => {

    const { format, range } = getPeriodClause(period);

    const sql = `
        SELECT
            DATE_FORMAT(start_date, ?) AS period_label,
            COUNT(*) AS total
        FROM membership
        WHERE start_date >= ${range}
        GROUP BY DATE_FORMAT(start_date, ?)
        ORDER BY period_label ASC
    `;

    const [rows] = await db.query(sql, [format, format]);

    return rows;
};

// =========================================
// EXPIRED MEMBERSHIPS OVER TIME
// =========================================

export const getExpiredMembershipsTrend = async (period) => {

    const { format, range } = getPeriodClause(period);

    const sql = `
        SELECT
            DATE_FORMAT(end_date, ?) AS period_label,
            COUNT(*) AS total
        FROM membership
        WHERE state = 'expired'
        AND end_date >= ${range}
        GROUP BY DATE_FORMAT(end_date, ?)
        ORDER BY period_label ASC
    `;

    const [rows] = await db.query(sql, [format, format]);

    return rows;
};

// =========================================
// PAYMENTS BY TYPE OVER TIME (approved only - same revenue-accuracy
// fix as getTotalIncome/getIncomeTrend)
// =========================================

export const getPaymentsByTypeTrend = async (period) => {

    const { format, range } = getPeriodClause(period);

    const sql = `
        SELECT
            DATE_FORMAT(p_date, ?) AS period_label,
            type,
            COALESCE(SUM(amount), 0) AS total
        FROM payment
        WHERE status = 'approved'
        AND p_date >= ${range}
        GROUP BY DATE_FORMAT(p_date, ?), type
        ORDER BY period_label ASC
    `;

    const [rows] = await db.query(sql, [format, format]);

    return rows;
};