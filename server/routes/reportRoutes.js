import express from "express";

import {fetchReports,
        fetchReportById,
        generateReport,
        removeReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", fetchReports);

router.get("/:id", fetchReportById);

router.post("/generate", generateReport);

router.delete("/:id", removeReport);

export default router;