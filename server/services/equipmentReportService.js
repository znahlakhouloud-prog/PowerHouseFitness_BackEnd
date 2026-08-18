import {
    createEquipmentReport,
    getEquipmentReportsByUser
} from "../models/equipmentReport.js";

// CREATE EQUIPMENT REPORT
export const createEquipmentReportService = async (id_user, data) => {

    return await createEquipmentReport({
        id_user,
        equipment_name: data.equipment_name,
        description: data.description
    });

};

// GET MY EQUIPMENT REPORTS
export const fetchMyEquipmentReportsService = async (id_user) => {

    return await getEquipmentReportsByUser(id_user);

};
