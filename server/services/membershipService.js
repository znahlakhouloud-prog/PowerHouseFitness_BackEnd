import {
    createMembership,
    getActiveMembershipByUserId,
    updateExpiredMemberships} from "../models/membershipModel.js";

import { userExists } from "../models/user.js";


export const createMembershipService = async (data) => {

    await updateExpiredMemberships();

    const exists = await userExists(data.id_user);

    if (!exists) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

     const activeMembership =
        await getActiveMembershipByUserId(data.id_user);

    if (activeMembership.length > 0) {
        const error = new Error("User already has an active membership");
        error.status = 409;
        throw error;
    }


    const startDate = new Date(data.start_date);

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + Number(data.duration));

    const membershipData = {
        ...data,
        end_date: endDate.toISOString().split("T")[0]
    };

    return await createMembership(membershipData);
};
