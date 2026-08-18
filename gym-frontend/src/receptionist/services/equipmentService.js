import api from "../../services/api";


// GET ALL EQUIPMENT
export const getEquipments = async () => {

    const response = await api.get(
        "/equipments"
    );

    return response.data;
};


// REPORT EQUIPMENT AS BROKEN (narrow action, not full edit)
export const reportEquipmentBroken = async (
    id
) => {

    const response = await api.patch(
        `/equipments/${id}/report-broken`
    );

    return response.data;
};
