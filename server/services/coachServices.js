import {
    getAllCoaches,
    getCoachById,
    getCoachByUserId,
    createCoach,
    updateCoach,
    deleteCoach
} from "../models/coach.js";

import { getUserById } from "../models/user.js";

// GET ALL COACHES
export const fetchCoachesService = async () => {

    return await getAllCoaches();

};

// GET COACH BY ID
export const fetchCoachByIdService = async (id) => {

    const coaches = await getCoachById(id);

    if (coaches.length === 0) {

        const error = new Error("Coach not found");
        error.status = 404;
        throw error;

    }

    return coaches[0];

};

// CREATE COACH
export const createCoachService = async (data) => {

    // Check user exists
    const users = await getUserById(data.id_user);

    if (users.length === 0) {

        const error = new Error("User not found");
        error.status = 404;
        throw error;

    }

    const user = users[0];

    // Check role
    if (user.role !== "coach") {

        const error = new Error("User is not a coach");
        error.status = 409;
        throw error;

    }

    // Check coach already exists
    const coach = await getCoachByUserId(data.id_user);

    if (coach.length > 0) {

        const error = new Error("Coach already exists");
        error.status = 409;
        throw error;

    }

    return await createCoach(data);

};

// UPDATE COACH
export const updateCoachService = async (id, data) => {

    const coaches = await getCoachById(id);

    if (coaches.length === 0) {

        const error = new Error("Coach not found");
        error.status = 404;
        throw error;

    }

    return await updateCoach(id, data);

};

// DELETE COACH
export const deleteCoachService = async (id) => {

    const coaches = await getCoachById(id);

    if (coaches.length === 0) {

        const error = new Error("Coach not found");
        error.status = 404;
        throw error;

    }

    return await deleteCoach(id);

};