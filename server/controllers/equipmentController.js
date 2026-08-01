import {
    getAllEquipments,
    getEquipmentById,
    updateEquipment,
    deleteEquipment } from "../models/equipment.js";

import { createEquipmentService,
         updateEquipmentService} from "../services/equipmentService.js";

export const fetchEquipments = async (req, res) => {

    try {

        const equipments = await getAllEquipments();

        res.json(equipments);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchEquipmentById = async (req, res) => {

    try {

        const equipment = await getEquipmentById(req.params.id);

        if (equipment.length === 0) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        res.json(equipment[0]);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const addEquipment = async (req, res) => {

    try {

        const result = await createEquipmentService(req.body);

        res.status(201).json({
            message: "Equipment created successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

export const editEquipment = async (req, res) => {

    try {

        const result = await updateEquipment(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        res.json({
            message: "Equipment updated successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

export const removeEquipment = async (req, res) => {

    try {

        const result = await deleteEquipment(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        res.json({
            message: "Equipment deleted successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};