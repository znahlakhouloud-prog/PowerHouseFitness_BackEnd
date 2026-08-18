import api from "../../services/api";


// GET ALL PLANS (read-only for receptionist)
export const getPlans = async () => {

    const response = await api.get(
        "/plans"
    );

    return response.data;
};
