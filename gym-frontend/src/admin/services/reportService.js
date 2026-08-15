import api from "../../services/api";


// GET DASHBOARD REPORT
export const getReports = async () => {

    const response = await api.get(
        "/reports/analytics"
    );

    return response.data;
};


// GET REPORT BY ID
export const getReportById = async (
    id
) => {

    const response = await api.get(
        `/reports/${id}`
    );

    return response.data;
};


// GENERATE REPORT
export const generateReport = async () => {

    const response = await api.post(
        "/reports/generate"
    );

    return response.data;
};


// DELETE REPORT
export const deleteReport = async (
    id
) => {

    const response = await api.delete(
        `/reports/${id}`
    );

    return response.data;
};