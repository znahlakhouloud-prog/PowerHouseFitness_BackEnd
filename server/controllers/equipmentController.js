import {
    fetchEquipmentsService,
    fetchEquipmentByIdService,
    createEquipmentService,
    updateEquipmentService,
    deleteEquipmentService
} from "../services/equipmentService.js";

// GET ALL EQUIPMENTS
export const fetchEquipments = async (req, res) => {

    try {

        const equipments =
            await fetchEquipmentsService();

        res.json(equipments);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET EQUIPMENT BY ID
export const fetchEquipmentById = async (req, res) => {

    try {

        const equipment =
            await fetchEquipmentByIdService(req.params.id);

        res.json(equipment);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE EQUIPMENT
export const addEquipment = async (req, res) => {

    try {

        const result =
            await createEquipmentService(req.body);

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

// UPDATE EQUIPMENT
export const editEquipment = async (req, res) => {

    try {

        await updateEquipmentService(
            req.params.id,
            req.body
        );

        res.json({
            message: "Equipment updated successfully"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// DELETE EQUIPMENT
export const removeEquipment = async (req, res) => {

    try {

        await deleteEquipmentService(req.params.id);

        res.json({
            message: "Equipment deleted successfully"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};