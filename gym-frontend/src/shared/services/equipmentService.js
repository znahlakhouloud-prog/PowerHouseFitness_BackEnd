import api from "../../services/api";


// GET ALL EQUIPMENT
export const getEquipments = async () => {

    const response = await api.get(
        "/equipments"
    );

    return response.data;
};


// REPORT BROKEN EQUIPMENT
export const reportEquipment = async (data) => {

    const response = await api.post(
        "/equipment-reports",
        data
    );

    return response.data;
};


// GET MY EQUIPMENT REPORTS
export const getMyEquipmentReports = async () => {

    const response = await api.get(
        "/equipment-reports/me"
    );

    return response.data;
};


// GET ALL EQUIPMENT REPORTS (admin/receptionist review list, any reporter)
export const getEquipmentReports = async () => {

    const response = await api.get(
        "/equipment-reports"
    );

    return response.data;
};
