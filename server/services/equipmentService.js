import {
    getAllEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    reportEquipmentBroken,
    deleteEquipment
} from "../models/equipment.js";

const allowedStates = [
    "available",
    "maintenance",
    "broken"
];

// GET ALL EQUIPMENTS
export const fetchEquipmentsService = async () => {

    return await getAllEquipments();

};

// GET EQUIPMENT BY ID
export const fetchEquipmentByIdService = async (id) => {

    const equipments = await getEquipmentById(id);

    if (equipments.length === 0) {

        const error = new Error("Equipment not found");
        error.status = 404;
        throw error;

    }

    return equipments[0];

};

// CREATE EQUIPMENT
export const createEquipmentService = async (data) => {

    if (!allowedStates.includes(data.state)) {

        const error = new Error("Invalid equipment state");
        error.status = 400;
        throw error;

    }

    const maintDate = new Date(data.maint_date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    maintDate.setHours(0, 0, 0, 0);

    if (maintDate > today) {

        const error = new Error(
            "Last maintenance date cannot be in the future"
        );
        error.status = 400;
        throw error;

    }

    return await createEquipment(data);

};

// UPDATE EQUIPMENT
export const updateEquipmentService = async (id, data) => {

    const equipments = await getEquipmentById(id);

    if (equipments.length === 0) {

        const error = new Error("Equipment not found");
        error.status = 404;
        throw error;

    }

    if (!allowedStates.includes(data.state)) {

        const error = new Error("Invalid equipment state");
        error.status = 400;
        throw error;

    }

    const maintDate = new Date(data.maint_date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    maintDate.setHours(0, 0, 0, 0);

    if (maintDate > today) {

        const error = new Error(
            "Last maintenance date cannot be in the future"
        );
        error.status = 400;
        throw error;

    }

    return await updateEquipment(id, data);

};

// REPORT EQUIPMENT BROKEN
export const reportEquipmentBrokenService = async (id) => {

    const equipments = await getEquipmentById(id);

    if (equipments.length === 0) {

        const error = new Error("Equipment not found");
        error.status = 404;
        throw error;

    }

    return await reportEquipmentBroken(id);

};

// DELETE EQUIPMENT
export const deleteEquipmentService = async (id) => {

    const equipments = await getEquipmentById(id);

    if (equipments.length === 0) {

        const error = new Error("Equipment not found");
        error.status = 404;
        throw error;

    }

    return await deleteEquipment(id);

};