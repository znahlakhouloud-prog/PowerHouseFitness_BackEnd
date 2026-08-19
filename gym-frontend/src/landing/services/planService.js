import api from "../../services/api";


// GET PUBLIC MEMBERSHIP PLAN CATALOG (no auth required)
export const getPublicPlans = async () => {

    const response = await api.get(
        "/plans/public"
    );

    return response.data;
};
