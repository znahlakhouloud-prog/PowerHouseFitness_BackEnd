import api from "../../services/api";


// GET MY CURRENT MEMBERSHIP
export const getMyMembership = async (id_user) => {

    const response = await api.get(
        `/memberships/check/${id_user}`
    );

    return response.data;
};


// GET MY BALANCE SUMMARY (current membership's paid/remaining, plus
// any unpaid balance carried over from previous memberships)
export const getMyBalance = async (id_user) => {

    const response = await api.get(
        `/memberships/balance/${id_user}`
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
