import api from "../../services/api";


// GET ALL MEMBERSHIP PLANS (read-only catalog for members)
export const getPlans = async () => {

    const response = await api.get(
        "/plans"
    );

    return response.data;
};
