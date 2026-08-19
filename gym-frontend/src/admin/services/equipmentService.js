import api from "../../services/api";


// GET ALL EQUIPMENT
export const getEquipments = async () => {

    const response = await api.get(
        "/equipments"
    );

    return response.data;
};


// CREATE EQUIPMENT
export const createEquipment = async (
    data
) => {

    const response = await api.post(
        "/equipments",
        data
    );

    return response.data;
};


// UPDATE EQUIPMENT
export const updateEquipment = async (
    id,
    data
) => {

    const response = await api.put(
        `/equipments/${id}`,
        data
    );

    return response.data;
};


// DELETE EQUIPMENT
export const deleteEquipment = async (
    id
) => {

    const response = await api.delete(
        `/equipments/${id}`
    );

    return response.data;
};


// GET ALL EQUIPMENT REPORTS (member/coach-submitted broken-equipment
// reports, any reporter)
export const getEquipmentReports = async () => {

    const response = await api.get(
        "/equipment-reports"
    );

    return response.data;
};
