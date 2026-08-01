import {
    getAllAttendances,
    getAttendanceById } from "../models/attendance.js";

import { createAttendanceService } from "../services/attendanceService.js";

export const fetchAttendances = async (req, res) => {

    try {

        const attendances = await getAllAttendances();

        res.json(attendances);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchAttendanceById = async (req, res) => {

    try {

        const attendance = await getAttendanceById(req.params.id);

        if (attendance.length === 0) {

            return res.status(404).json({
                message: "Attendance not found"
            });

        }

        res.json(attendance[0]);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const checkIn = async (req, res) => {

    try {

        const result = await createAttendanceService(req.body);

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