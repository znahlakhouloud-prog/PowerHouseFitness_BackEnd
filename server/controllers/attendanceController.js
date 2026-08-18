import {
    fetchAttendancesService,
    fetchAttendanceByIdService,
    fetchAttendanceByUserIdService,
    createAttendanceService
} from "../services/attendanceService.js";

// GET ALL ATTENDANCES
export const fetchAttendances = async (req, res) => {

    try {

        const attendances =
            await fetchAttendancesService();

        res.json(attendances);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET ATTENDANCE BY ID
export const fetchAttendanceById = async (req, res) => {

    try {

        const attendance =
            await fetchAttendanceByIdService(req.params.id);

        res.json(attendance);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET ATTENDANCE HISTORY FOR ONE USER
export const fetchAttendanceByUserId = async (req, res) => {

    try {

        const attendances =
            await fetchAttendanceByUserIdService(req.params.id_user);

        res.json(attendances);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// MEMBER CHECK-IN
export const checkIn = async (req, res) => {

    try {

        const result =
            await createAttendanceService(req.body);

        res.status(201).json({
            message: "Check-in successful",
            id: result.insertId
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};