import api from "../../services/api";


// GET PAYMENTS FOR A MEMBERSHIP
export const getPaymentsByMembership = async (
    id_membership
) => {

    const response = await api.get(
        `/payments/membership/${id_membership}`
    );

    return response.data;
};
