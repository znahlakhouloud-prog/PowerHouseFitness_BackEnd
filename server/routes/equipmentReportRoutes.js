import express from "express";

import {
    addEquipmentReport,
    fetchMyEquipmentReports,
    fetchAllEquipmentReports
} from "../controllers/equipmentReportController.js";

import { validateEquipmentReport } from "../middleware/validateEquipmentReport.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

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

// Admin/receptionist review list - all reports, any reporter
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchAllEquipmentReports
);

export default router;
