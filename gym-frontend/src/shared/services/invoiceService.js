import api from "../../services/api";


// GET INVOICE DATA FOR ONE PAYMENT (safe fields only - the backend
// never returns a member's password or any card number/CVV/PIN,
// which don't exist anywhere in this data to begin with)
export const getInvoice = async (paymentId) => {

    const response = await api.get(
        `/payments/invoice/${paymentId}`
    );

    return response.data;
};
