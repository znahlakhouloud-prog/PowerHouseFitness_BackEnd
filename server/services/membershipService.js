import {
    getAllMemberships,
    getMembershipById,
    getMembershipsByUserId,
    createMembership,
    updateMembership,
    getActiveMembershipByUserId,
    updateExpiredMemberships as updateExpiredMembershipsModel
} from "../models/membership.js";

import { getTotalPaidByMembership } from "../models/payment.js";
import { getPlanRowById } from "../models/plan.js";
import { userExists } from "../models/user.js";
import { notifyAdmins, notifyMemberOfUnpaidBalance } from "./notificationService.js";

/*
 * Turns a verified plan row + staff-supplied start date/promo days
 * into the membership fields to persist. Centralized here so every
 * membership-creation path (registration, self-subscribe, direct
 * create) derives price/duration/name/type from the database plan,
 * never from the caller.
 */
export const buildMembershipDataFromPlan = (plan, data) => {

    const startDate = new Date(data.start_date);
    const endDate = new Date(startDate);

    const durationPromo = Number(data.duration_promo ?? 0);

    endDate.setDate(
        startDate.getDate() + plan.duration_days + durationPromo
    );

    return {
        id_user: data.id_user,
        name: plan.name,
        duration: plan.duration_days,
        price: plan.price,
        start_date: data.start_date,
        end_date: endDate.toISOString().split("T")[0],
        state: "active",
        duration_promo: durationPromo,
        type: plan.type
    };

};


// Runs the expiry check and notifies admins about any membership
// that just transitioned to expired in this call - not on every
// subsequent check, since the model only ever returns rows that are
// still "active" at query time. If a membership that just expired
// still has an unpaid balance, the member is also reminded here -
// this is a one-shot transition (the same row can never be picked up
// as "newly expired" twice), so this can never fire the reminder
// more than once for the same season ending unpaid.
export const checkExpiredMemberships = async () => {

    const newlyExpired = await updateExpiredMembershipsModel();

    for (const membership of newlyExpired) {

        try {

            await notifyAdmins({
                title: "Membership Expired",
                descrip: `${membership.user_name}'s ${membership.name} membership expired`,
                type: "membership"
            });

        } catch (notifyError) {

            console.error("NOTIFY ADMINS ERROR (membership expired):", notifyError);

        }

        try {

            const totalPaid = await getTotalPaidByMembership(membership.id);
            const remaining = Math.max(0, membership.price - totalPaid);

            if (remaining > 0) {

                await notifyMemberOfUnpaidBalance(membership.id_user, remaining);

            }

        } catch (notifyError) {

            console.error("NOTIFY MEMBER ERROR (unpaid balance on expiry):", notifyError);

        }

    }

    return newlyExpired;

};


// Computes a member's balance picture: their current membership (if
// any) with its own paid/remaining, plus the total still owed across
// every OTHER (necessarily past) membership they've ever had. Since a
// user can only ever have one active membership at a time, "current"
// unambiguously means the single active row if one exists - every
// other row is by definition a previous season.
export const getBalanceSummaryService = async (id_user) => {

    await checkExpiredMemberships();

    const exists = await userExists(id_user);

    if (!exists) {
        throw new Error("USER_NOT_FOUND");
    }

    const memberships = await getMembershipsByUserId(id_user);

    const current = memberships.find((m) => m.state === "active") || null;

    let previousUnpaidBalance = 0;
    const previousBreakdown = [];

    for (const membership of memberships) {

        if (current && membership.id === current.id) {
            continue;
        }

        const totalPaid = await getTotalPaidByMembership(membership.id);
        const remaining = Math.max(0, membership.price - totalPaid);

        if (remaining > 0) {

            previousUnpaidBalance += remaining;

            previousBreakdown.push({
                id: membership.id,
                name: membership.name,
                price: membership.price,
                paid: totalPaid,
                remaining,
                end_date: membership.end_date
            });

        }

    }

    let currentMembership = null;

    if (current) {

        const totalPaid = await getTotalPaidByMembership(current.id);

        currentMembership = {
            ...current,
            paid: totalPaid,
            remaining: Math.max(0, current.price - totalPaid)
        };

    }

    return {
        currentMembership,
        previousUnpaidBalance,
        previousBreakdown
    };

};


// GET ALL MEMBERSHIPS
export const fetchMembershipsService = async () => {

    await checkExpiredMemberships();

    return await getAllMemberships();

};

// GET MEMBERSHIP BY ID
export const fetchMembershipByIdService = async (id) => {

    await checkExpiredMemberships();

    const memberships = await getMembershipById(id);

    if (memberships.length === 0) {
        throw new Error("MEMBERSHIP_NOT_FOUND");
    }

    return memberships[0];

};

// CREATE MEMBERSHIP (price/duration/name/type are never trusted from
// the caller - they're always derived from the real plan row).
//
// `requesterRole` decides how a previous unpaid balance is handled:
// a member subscribing themselves is blocked outright (they must
// settle the old balance first); admin/receptionist keep the
// discretion to start a new season for a member who still owes money
// (e.g. the debt is being handled outside the app) - either way, if
// a balance is carried over, the member is reminded about it once the
// new membership is created.
export const createMembershipService = async (data, requesterRole) => {

    await checkExpiredMemberships();

    const exists = await userExists(data.id_user);

    if (!exists) {
        throw new Error("USER_NOT_FOUND");
    }

    const activeMembership =
        await getActiveMembershipByUserId(data.id_user);

    if (activeMembership.length > 0) {
        throw new Error("ACTIVE_MEMBERSHIP_EXISTS");
    }

    // No active membership exists at this point (checked above), so
    // every membership this returns is necessarily a past season -
    // this is exactly "how much does this member still owe overall".
    const { previousUnpaidBalance } =
        await getBalanceSummaryService(data.id_user);

    if (previousUnpaidBalance > 0 && requesterRole === "member") {

        const error = new Error("PREVIOUS_BALANCE_UNPAID");
        error.amount = previousUnpaidBalance;
        throw error;

    }

    const planRows = await getPlanRowById(data.id_plan);

    if (planRows.length === 0) {
        throw new Error("PLAN_NOT_FOUND");
    }

    const membershipData = buildMembershipDataFromPlan(
        planRows[0],
        data
    );

    const result = await createMembership(membershipData);

    if (previousUnpaidBalance > 0) {

        try {

            await notifyMemberOfUnpaidBalance(
                data.id_user,
                previousUnpaidBalance
            );

        } catch (notifyError) {

            console.error("NOTIFY MEMBER ERROR (unpaid balance on new season):", notifyError);

        }

    }

    return result;

};

// UPDATE MEMBERSHIP (same rule - price/duration/name/type come from
// the real plan row, never from the caller)
export const updateMembershipService = async (id, data) => {

    const memberships = await getMembershipById(id);

    if (memberships.length === 0) {
        throw new Error("MEMBERSHIP_NOT_FOUND");
    }

    const planRows = await getPlanRowById(data.id_plan);

    if (planRows.length === 0) {
        throw new Error("PLAN_NOT_FOUND");
    }

    const { id_user, ...membershipData } = buildMembershipDataFromPlan(
        planRows[0],
        { ...data, id_user: memberships[0].id_user }
    );

    return await updateMembership(id, membershipData);

};

// CHECK MEMBERSHIP ACCESS
export const checkMembershipAccessService = async (id_user) => {

    await checkExpiredMemberships();

    const memberships =
        await getActiveMembershipByUserId(id_user);

    if (memberships.length === 0) {
        throw new Error("NO_ACTIVE_MEMBERSHIP");
    }

    return memberships[0];

};

// RENEW MEMBERSHIP (admin/receptionist only route - always passed
// through as staff, so createMembershipService never blocks it for
// previous debt, only the member self-service path can be blocked)
export const renewMembershipService = async (data, requesterRole) => {

    return await createMembershipService(data, requesterRole);

};