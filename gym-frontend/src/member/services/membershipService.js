import api from "../../services/api";


// GET MY CURRENT MEMBERSHIP
export const getMyMembership = async (id_user) => {

    const response = await api.get(
        `/memberships/check/${id_user}`
    );

    return response.data;
};


// SUBSCRIBE TO A PLAN (self-service - fails if already active)
export const subscribeToPlan = async (data) => {

    const response = await api.post(
        "/memberships",
        data
    );

    return response.data;
};
