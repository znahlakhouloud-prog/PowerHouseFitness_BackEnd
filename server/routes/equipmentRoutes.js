import express from "express";

import {
    fetchEquipments,
    fetchEquipmentById,
    addEquipment,
    editEquipment,
    removeEquipment
} from "../controllers/equipmentController.js";

import { validateEquipment } from "../middleware/validateEquipment.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Everyone authenticated can view equipments
router.get(
    "/",
    authenticateToken,
    fetchEquipments
);

router.get(
    "/:id",
    authenticateToken,
    fetchEquipmentById
);

// Only admin can create
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    validateEquipment,
    addEquipment
);

// Only admin can update
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    validateEquipment,
    editEquipment
);

// Only admin can delete
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    removeEquipment
);

export default router;