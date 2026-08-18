import {
    getAllReports,
    getReportById,
    createReport,
    deleteReport,
    getTotalIncome,
    getNewMembers,
    getExpiredMemberships,
    getTopMembership,
    getAttendanceCount,
    getMonthlyIncome,
    getMonthlyNewMembers,
    getMonthlyAttendance,
    getMonthlyExpiredMemberships,
    getMonthlyPaymentsByType
} from "../models/report.js";

// Reshape flat {month, type, total} rows into one object per month:
// [{month, cash, card, transfer}, ...] - what a stacked bar chart needs
const groupPaymentsByMonth = (rows) => {

    const monthsByKey = new Map();

    for (const row of rows) {

        if (!monthsByKey.has(row.month)) {

            monthsByKey.set(row.month, {
                month: row.month,
                cash: 0,
                card: 0,
                transfer: 0
            });

        }

        monthsByKey.get(row.month)[row.type] = Number(row.total);

    }

    return Array.from(monthsByKey.values());

};

//    GET ALL REPORTS
export const getAllReportsService = async () => {

    return await getAllReports();

};

//    GET REPORT BY ID
export const getReportByIdService = async (id) => {

    const reports = await getReportById(id);

    if (reports.length === 0) {

        const error = new Error("Report not found");
        error.status = 404;

        throw error;

    }

    return reports[0];

};

//    GENERATE REPORT
export const generateReportService = async () => {

    const income = await getTotalIncome();

    const nbrNewMember = await getNewMembers();

    const nbrExpiredMembership =
        await getExpiredMemberships();

    const topMembership =
        await getTopMembership();

    const nbrAttendance =
        await getAttendanceCount();

    const reportData = {

        income,

        nbr_new_member: nbrNewMember,

        nbr_expired_membership:
            nbrExpiredMembership,

        top_membership: topMembership,

        nbr_attendance: nbrAttendance

    };

    return await createReport(reportData);

};

//    DELETE REPORT
export const deleteReportService = async (id) => {

    const result = await deleteReport(id);

    if (result.affectedRows === 0) {

        const error = new Error("Report not found");
        error.status = 404;

        throw error;

    }

    return result;

};

// =========================================
// DASHBOARD ANALYTICS
// =========================================

export const getDashboardAnalyticsService = async () => {

    const income =
        await getTotalIncome();

    const newMembers =
        await getNewMembers();

    const expiredMemberships =
        await getExpiredMemberships();

    const topMembership =
        await getTopMembership();

    const attendance =
        await getAttendanceCount();

    const monthlyIncome =
        await getMonthlyIncome();

    const monthlyNewMembers =
        await getMonthlyNewMembers();

    const monthlyAttendance =
        await getMonthlyAttendance();

    const monthlyExpiredMemberships =
        await getMonthlyExpiredMemberships();

    const monthlyPaymentsByTypeRows =
        await getMonthlyPaymentsByType();

    const monthlyPaymentsByType =
        groupPaymentsByMonth(monthlyPaymentsByTypeRows);


    return {

        income,

        newMembers,

        expiredMemberships,

        topMembership,

        attendance,

        monthlyIncome,

        monthlyNewMembers,

        monthlyAttendance,

        monthlyExpiredMemberships,

        monthlyPaymentsByType

    };

};