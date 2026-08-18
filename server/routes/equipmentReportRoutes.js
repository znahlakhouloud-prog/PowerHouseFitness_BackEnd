import express from "express";

import {
    addEquipmentReport,
    fetchMyEquipmentReports
} from "../controllers/equipmentReportController.js";

import { validateEquipmentReport } from "../middleware/validateEquipmentReport.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any authenticated user can report/view their own equipment reports -
// in practice this is the member-facing "report broken equipment" flow
router.post(
    "/",
    authenticateToken,
    validateEquipmentReport,
    addEquipmentReport
);

router.get(
    "/me",
    authenticateToken,
    fetchMyEquipmentReports
);

export default router;
