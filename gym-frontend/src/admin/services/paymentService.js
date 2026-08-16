import api from "../../services/api";


// GET ALL PAYMENTS
export const getPayments = async () => {

    const response = await api.get(
        "/payments"
    );

    return response.data;
};


// CREATE PAYMENT
export const createPayment = async (
    data
) => {

    const response = await api.post(
        "/payments",
        data
    );

    return response.data;
};


// UPDATE PAYMENT
export const updatePayment = async (
    id,
    data
) => {

    const response = await api.put(
        `/payments/${id}`,
        data
    );

    return response.data;
};


// DELETE PAYMENT
export const deletePayment = async (
    id
) => {

    const response = await api.delete(
        `/payments/${id}`
    );

    return response.data;
};
