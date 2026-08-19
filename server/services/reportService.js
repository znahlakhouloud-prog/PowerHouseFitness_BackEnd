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
    getActiveMembersCount,
    getAttendanceToday,
    getPendingPaymentsCount,
    getEquipmentIssuesCount,
    getRecentRegistrations,
    getRecentPayments,
    getRecentExpiredMemberships,
    getRecentEquipmentReports,
    getIncomeTrend,
    getAttendanceTrend,
    getNewMembersTrend,
    getExpiredMembershipsTrend,
    getPaymentsByTypeTrend
} from "../models/report.js";

import { getAllMemberships } from "../models/membership.js";

const VALID_PERIODS = ["week", "month", "year"];

// Membership rows only ever store "active"/"expired" - "expiring
// soon" is derived here the same way the frontend already does it
// (member/utils/membershipStatus.js), so the dashboard's donut chart
// matches what every role's own UI already shows.
const EXPIRING_SOON_THRESHOLD_DAYS = 7;

const getMembershipStatusBreakdown = (memberships) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const breakdown = { active: 0, expiring: 0, expired: 0 };

    for (const membership of memberships) {

        if (membership.state === "expired") {
            breakdown.expired++;
            continue;
        }

        const endDate = new Date(membership.end_date);
        endDate.setHours(0, 0, 0, 0);

        const remainingDays = Math.round(
            (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (remainingDays <= EXPIRING_SOON_THRESHOLD_DAYS) {
            breakdown.expiring++;
        } else {
            breakdown.active++;
        }

    }

    return breakdown;

};

// Reshape flat {period_label, type, total} rows into one object per
// bucket: [{period_label, cash, card, transfer}, ...] - what a
// stacked bar chart needs
const groupPaymentsByPeriod = (rows) => {

    const bucketsByKey = new Map();

    for (const row of rows) {

        if (!bucketsByKey.has(row.period_label)) {

            bucketsByKey.set(row.period_label, {
                period_label: row.period_label,
                cash: 0,
                card: 0,
                transfer: 0
            });

        }

        bucketsByKey.get(row.period_label)[row.type] = Number(row.total);

    }

    return Array.from(bucketsByKey.values());

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

export const getDashboardAnalyticsService = async (rawPeriod) => {

    const period = VALID_PERIODS.includes(rawPeriod)
        ? rawPeriod
        : "year";

    const income = await getTotalIncome();
    const newMembers = await getNewMembers();
    const expiredMemberships = await getExpiredMemberships();
    const topMembership = await getTopMembership();
    const attendance = await getAttendanceCount();

    const activeMembers = await getActiveMembersCount();
    const attendanceToday = await getAttendanceToday();
    const pendingPayments = await getPendingPaymentsCount();
    const equipmentIssues = await getEquipmentIssuesCount();

    const memberships = await getAllMemberships();
    const membershipStatus = getMembershipStatusBreakdown(memberships);

    const incomeTrend = await getIncomeTrend(period);
    const attendanceTrend = await getAttendanceTrend(period);
    const newMembersTrend = await getNewMembersTrend(period);
    const expiredMembershipsTrend = await getExpiredMembershipsTrend(period);

    const paymentsByTypeRows = await getPaymentsByTypeTrend(period);
    const paymentsByTypeTrend = groupPaymentsByPeriod(paymentsByTypeRows);

    return {

        period,

        income,
        newMembers,
        expiredMemberships,
        topMembership,
        attendance,

        activeMembers,
        attendanceToday,
        pendingPayments,
        equipmentIssues,

        membershipStatus,

        incomeTrend,
        attendanceTrend,
        newMembersTrend,
        expiredMembershipsTrend,
        paymentsByTypeTrend

    };

};

// =========================================
// RECENT ACTIVITY (merged chronologically across sources in JS -
// each source table has a different, non-comparable id sequence and
// only some have real timestamps, so the merge can't happen in SQL)
// =========================================

export const getRecentActivityService = async (limit = 15) => {

    const [registrations, payments, expiredMemberships, equipmentReports] =
        await Promise.all([
            getRecentRegistrations(limit),
            getRecentPayments(limit),
            getRecentExpiredMemberships(limit),
            getRecentEquipmentReports(limit)
        ]);

    const events = [

        ...registrations.map((r) => ({
            type: "registration",
            title: "New user registered",
            description: `${r.user_name} joined as ${r.role}`,
            date: r.created_at
        })),

        ...payments.map((p) => ({
            type: "payment",
            title: p.status === "approved"
                ? "Payment received"
                : `Payment ${p.status}`,
            description: `${p.user_name} - ${Number(p.amount).toLocaleString()} DA`,
            date: p.p_date
        })),

        ...expiredMemberships.map((m) => ({
            type: "membership_expired",
            title: "Membership expired",
            description: `${m.user_name}'s ${m.name} membership expired`,
            date: m.end_date
        })),

        ...equipmentReports.map((e) => ({
            type: "equipment_report",
            title: "Equipment reported",
            description: `${e.equipment_name} reported by ${e.user_name}`,
            date: e.created_at
        }))

    ];

    events.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return events.slice(0, limit);

};
