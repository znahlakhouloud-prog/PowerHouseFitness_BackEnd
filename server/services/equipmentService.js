import {
    createEquipment,
    updateEquipment } from "../models/equipment.js";

export const createEquipmentService = async (data) => {

    const allowedStates = [
        "available",
        "maintenance",
        "broken"
    ];

    if (!allowedStates.includes(data.state)) {

        const error = new Error(
            "Invalid equipment state"
        );

        error.status = 400;

        throw error;
    }

    return await createEquipment(data);
};

export const updateEquipmentService = async (id, data) => {

    const allowedStates = [
        "available",
        "maintenance",
        "broken"
    ];

    if (!allowedStates.includes(data.state)) {

        const error = new Error(
            "Invalid equipment state"
        );

        error.status = 400;

        throw error;
    }

    return await updateEquipment(id, data);
};