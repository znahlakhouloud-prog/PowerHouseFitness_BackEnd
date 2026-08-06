import express from "express";

import {
    fetchReports,
    fetchReportById,
    generateReport,
    removeReport
} from "../controllers/reportController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only authenticated admins
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/", fetchReports);

router.get("/:id", fetchReportById);

router.post("/generate", generateReport);

router.delete("/:id", removeReport);

export default router;