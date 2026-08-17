import {
    getAllMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    getActiveMembershipByUserId,
    updateExpiredMemberships
} from "../models/membership.js";

import { userExists } from "../models/user.js";


// GET ALL MEMBERSHIPS
export const fetchMembershipsService = async () => {

    await updateExpiredMemberships();

    return await getAllMemberships();

};

// GET MEMBERSHIP BY ID
export const fetchMembershipByIdService = async (id) => {

    await updateExpiredMemberships();

    const memberships = await getMembershipById(id);

    if (memberships.length === 0) {
        throw new Error("MEMBERSHIP_NOT_FOUND");
    }

    return memberships[0];

};

// CREATE MEMBERSHIP
export const createMembershipService = async (data) => {

    await updateExpiredMemberships();

    const exists = await userExists(data.id_user);

    if (!exists) {
        throw new Error("USER_NOT_FOUND");
    }

    const activeMembership =
        await getActiveMembershipByUserId(data.id_user);

    if (activeMembership.length > 0) {
        throw new Error("ACTIVE_MEMBERSHIP_EXISTS");
    }

    const startDate = new Date(data.start_date);

    const endDate = new Date(startDate);

    endDate.setDate(
        startDate.getDate() + Number(data.duration)
    );

    const membershipData = {
    id_user: data.id_user,
    name: data.name,
    duration: data.duration,
    price: data.price,
    start_date: data.start_date,
    end_date: endDate.toISOString().split("T")[0],
    state: "active",
    duration_promo: data.duration_promo ?? 0,
    type: data.type
};

    return await createMembership(membershipData);

};

// UPDATE MEMBERSHIP
export const updateMembershipService = async (id, data) => {

    const memberships = await getMembershipById(id);

    if (memberships.length === 0) {
        throw new Error("MEMBERSHIP_NOT_FOUND");
    }

    const startDate = new Date(data.start_date);

    const endDate = new Date(startDate);

    endDate.setDate(
        startDate.getDate() + Number(data.duration)
    );

    const membershipData = {
        name: data.name,
        duration: data.duration,
        price: data.price,
        start_date: data.start_date,
        end_date: endDate.toISOString().split("T")[0],
        duration_promo: data.duration_promo ?? 0,
        type: data.type
    };

    return await updateMembership(id, membershipData);

};

// CHECK MEMBERSHIP ACCESS
export const checkMembershipAccessService = async (id_user) => {

    await updateExpiredMemberships();

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