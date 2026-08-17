import {
    fetchPlansService,
    createPlanService,
    updatePlanService,
    deletePlanService
} from "../services/planService.js";

// GET ALL PLANS
export const fetchPlans = async (req, res) => {

    try {

        const plans = await fetchPlansService();

        res.json(plans);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE PLAN
export const addPlan = async (req, res) => {

    try {

        const plan = await createPlanService(req.body);

        res.status(201).json({
            message: "Plan created successfully",
            plan
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// UPDATE PLAN
export const editPlan = async (req, res) => {

    try {

        const plan = await updatePlanService(
            req.params.id,
            req.body
        );

        res.json({
            message: "Plan updated successfully",
            plan
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// DELETE PLAN
export const removePlan = async (req, res) => {

    try {

        await deletePlanService(req.params.id);

        res.json({
            message: "Plan deleted successfully"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};
