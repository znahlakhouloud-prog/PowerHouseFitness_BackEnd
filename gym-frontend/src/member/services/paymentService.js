import api from "../../services/api";


// GET MY PAYMENTS FOR A MEMBERSHIP
export const getMyPayments = async (id_membership) => {

    const response = await api.get(
        `/payments/membership/${id_membership}`
    );

    return response.data;
};


// PAY BY CARD (mock - no card details are ever sent or stored,
// this just simulates an instantly-approved payment)
export const payWithCard = async (id_membership, amount) => {

    const response = await api.post(
        "/payments/me",
        {
            id_membership,
            amount,
            type: "card"
        }
    );

    return response.data;
};


// PAY BY BANK TRANSFER (goes in as pending until reviewed)
export const payWithTransfer = async (id_membership, amount, receiptFile) => {

    const formData = new FormData();

    formData.append("id_membership", id_membership);
    formData.append("amount", amount);
    formData.append("type", "transfer");
    formData.append("receipt", receiptFile);

    const response = await api.post(
        "/payments/me",
        formData,
        {
            // The shared api instance defaults Content-Type to
            // application/json, which stops axios from setting the
            // multipart boundary for FormData - clear it so the
            // browser fills in the correct multipart header.
            headers: { "Content-Type": undefined }
        }
    );

    return response.data;
};
