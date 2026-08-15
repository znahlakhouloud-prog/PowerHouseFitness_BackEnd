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
    getMonthlyAttendance
} from "../models/report.js";

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


    return {

        income,

        newMembers,

        expiredMemberships,

        topMembership,

        attendance,

        monthlyIncome,

        monthlyNewMembers,

        monthlyAttendance

    };

};