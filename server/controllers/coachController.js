import {
    getAllCoaches,
    getCoachById,
    updateCoach,
    deleteCoach } from "../models/coach.js";

import { createCoachService } from "../services/coachServices.js";

export const fetchCoaches = async (req, res) => {

    try {

        const coaches = await getAllCoaches();

        res.json(coaches);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchCoachById = async (req, res) => {

    try {

        const coach = await getCoachById(req.params.id);

        if (coach.length === 0) {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        res.json(coach[0]);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const addCoach = async (req, res) => {

    try {

        const result = await createCoachService(req.body);

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

export const editCoach = async (req, res) => {

    try {

        const result = await updateCoach(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        res.json({
            message: "Coach updated successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

export const removeCoach = async (req, res) => {

    try {

        const result = await deleteCoach(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        res.json({
            message: "Coach deleted successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};