import {
    getAllAttendances,
    getAttendanceById,
    getAttendanceByUserId,
    getAttendanceToday,
    createAttendance
} from "../models/attendance.js";

import { getUserById } from "../models/user.js";
import { getActiveMembershipByUserId } from "../models/membership.js";
import { checkExpiredMemberships } from "./membershipService.js";

// GET ALL ATTENDANCES
export const fetchAttendancesService = async () => {

    return await getAllAttendances();

};

// GET ATTENDANCE BY ID
export const fetchAttendanceByIdService = async (id) => {

    const attendances = await getAttendanceById(id);

    if (attendances.length === 0) {

        const error = new Error("Attendance not found");
        error.status = 404;
        throw error;

    }

    return attendances[0];

};

// GET ATTENDANCE HISTORY FOR ONE USER
export const fetchAttendanceByUserIdService = async (id_user) => {

    return await getAttendanceByUserId(id_user);

};

// CREATE ATTENDANCE (CHECK-IN)
export const createAttendanceService = async (data) => {
    //1. Update expired memberships first
    await checkExpiredMemberships();

    //2. Check user exists
    const user = await getUserById(data.id_user);

    if (user.length === 0) {

        const error = new Error("User not found");
        error.status = 404;
        throw error;

    }

    //3. Check active membership
    const membership =
        await getActiveMembershipByUserId(data.id_user);

    if (membership.length === 0) {

        const error = new Error("No active membership");
        error.status = 403;
        throw error;

    }

    // 4. Already checked in today?
    const attendanceToday =
        await getAttendanceToday(data.id_user);

    if (attendanceToday.length > 0) {

        const error = new Error("Member already checked in today");
        error.status = 409;
        throw error;

    }

    // 5. Create attendance
    const now = new Date();

    const attendance = {

        id_user: data.id_user,

        attendance_date:
            now.toISOString().split("T")[0],

        check_in: now

    };

    return await createAttendance(attendance);

};