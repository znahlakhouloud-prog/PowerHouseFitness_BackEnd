import {
    fetchCoachesService,
    fetchCoachByIdService,
    createCoachService,
    updateCoachService,
    deleteCoachService
} from "../services/coachServices.js";

// GET ALL COACHES
export const fetchCoaches = async (req, res) => {

    try {

        const coaches = await fetchCoachesService();

        res.json(coaches);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET COACH BY ID
export const fetchCoachById = async (req, res) => {

    try {

        const coach =
            await fetchCoachByIdService(req.params.id);

        res.json(coach);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE COACH
export const addCoach = async (req, res) => {

    try {

        const result =
            await createCoachService(req.body);

        res.status(201).json({

            message: "Coach created successfully",
            id: result.insertId

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// UPDATE COACH
export const editCoach = async (req, res) => {

    try {

        await updateCoachService(
            req.params.id,
            req.body
        );

        res.json({

            message: "Coach updated successfully"

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// DELETE COACH
export const removeCoach = async (req, res) => {

    try {

        await deleteCoachService(req.params.id);

        res.json({

            message: "Coach deleted successfully"

        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};