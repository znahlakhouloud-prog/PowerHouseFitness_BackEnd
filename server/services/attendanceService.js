import {
    createAttendance,
    getAttendanceToday } from "../models/attendance.js";

import { getUserById } from "../models/user.js";

import { getActiveMembershipByUserId } from "../models/membership.js";

export const createAttendanceService = async (data) => {

    // 1. User exists
    const user = await getUserById(data.id_user);

    if (user.length === 0) {

        const error = new Error("User not found");
        error.status = 404;
        throw error;

    }

    // 2. Active membership
    const membership =
        await getActiveMembershipByUserId(data.id_user);

    if (membership.length === 0) {

        const error = new Error("No active membership");
        error.status = 403;
        throw error;

    }

    // 3. Already checked in today?
    const today =
        await getAttendanceToday(data.id_user);

    if (today.length > 0) {

        const error = new Error("Member already checked in today");
        error.status = 409;
        throw error;

    }

    // 4. Create attendance
    const attendance = {

        id_user: data.id_user,

        attendance_date:
            new Date().toISOString().split("T")[0],

        check_in:
            new Date()

    };

    return await createAttendance(attendance);

};