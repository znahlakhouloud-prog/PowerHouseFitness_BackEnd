import api from "../../services/api";


// GET MY PAYMENTS FOR A MEMBERSHIP
export const getMyPayments = async (id_membership) => {

    const response = await api.get(
        `/payments/membership/${id_membership}`
    );

    return response.data;
};


// PAY BY CASH (the only payment method the application accepts -
// always approved instantly, no pending review step). `type: "cash"`
// is sent explicitly for clarity, but the backend hardcodes it
// regardless - this value is never trusted as the actual method.
export const payCash = async (id_membership, amount) => {

    const response = await api.post(
        "/payments/me",
        {
            id_membership,
            amount,
            type: "cash"
        }
    );

    return response.data;
};
