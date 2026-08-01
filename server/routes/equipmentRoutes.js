import express from "express";

import {
    fetchEquipments,
    fetchEquipmentById,
    addEquipment,
    editEquipment,
    removeEquipment } from "../controllers/equipmentController.js";

import { validateEquipment } from "../middleware/validateEquipment.js";

const router = express.Router();

router.get("/", fetchEquipments);

router.get("/:id", fetchEquipmentById);

router.post("/", validateEquipment, addEquipment);

router.put("/:id", validateEquipment, editEquipment);

router.delete("/:id", removeEquipment);

export default router;