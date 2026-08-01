import express from "express";

import {
    fetchAttendances,
    fetchAttendanceById,
    checkIn } from "../controllers/attendanceController.js";

import { validateAttendance } from "../middleware/validateAttendance.js";

const router = express.Router();

router.get("/", fetchAttendances);

router.get("/:id", fetchAttendanceById);

router.post("/check-in", validateAttendance, checkIn);

export default router;