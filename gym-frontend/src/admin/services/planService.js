import api from "../../services/api";


// GET ALL PLANS
export const getPlans = async () => {

    const response = await api.get(
        "/plans"
    );

    return response.data;
};


// CREATE PLAN
export const createPlan = async (
    data
) => {

    const response = await api.post(
        "/plans",
        data
    );

    return response.data;
};


// UPDATE PLAN
export const updatePlan = async (
    id,
    data
) => {

    const response = await api.put(
        `/plans/${id}`,
        data
    );

    return response.data;
};


// DELETE PLAN
export const deletePlan = async (
    id
) => {

    const response = await api.delete(
        `/plans/${id}`
    );

    return response.data;
};
