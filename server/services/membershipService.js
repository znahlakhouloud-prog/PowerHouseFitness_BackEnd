import {
    getAllMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    getActiveMembershipByUserId,
    updateExpiredMemberships as updateExpiredMembershipsModel
} from "../models/membership.js";

import { getPlanRowById } from "../models/plan.js";
import { userExists } from "../models/user.js";
import { notifyAdmins } from "./notificationService.js";

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
// still "active" at query time.
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

    }

    return newlyExpired;

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
// the caller - they're always derived from the real plan row)
export const createMembershipService = async (data) => {

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

    const planRows = await getPlanRowById(data.id_plan);

    if (planRows.length === 0) {
        throw new Error("PLAN_NOT_FOUND");
    }

    const membershipData = buildMembershipDataFromPlan(
        planRows[0],
        data
    );

    return await createMembership(membershipData);

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

// RENEW MEMBERSHIP
export const renewMembershipService = async (data) => {

    return await createMembershipService(data);

};