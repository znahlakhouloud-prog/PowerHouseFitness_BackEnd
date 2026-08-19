import {
    createEquipmentReport,
    getEquipmentReportsByUser,
    getAllEquipmentReports
} from "../models/equipmentReport.js";

import { getUserById } from "../models/user.js";
import { notifyAdmins } from "./notificationService.js";

// CREATE EQUIPMENT REPORT
export const createEquipmentReportService = async (id_user, data) => {

    const result = await createEquipmentReport({
        id_user,
        equipment_name: data.equipment_name,
        description: data.description
    });

    // Non-fatal - the report must still succeed even if this fails
    try {

        const users = await getUserById(id_user);
        const reporterName = users[0]?.user_name || "Someone";

        await notifyAdmins({
            title: "Equipment Report",
            descrip: `${data.equipment_name} reported as broken by ${reporterName}`,
            type: "equipment"
        });

    } catch (notifyError) {

        console.error("NOTIFY ADMINS ERROR (equipment report):", notifyError);

    }

    return result;

};

// GET MY EQUIPMENT REPORTS
export const fetchMyEquipmentReportsService = async (id_user) => {

    return await getEquipmentReportsByUser(id_user);

};

// GET ALL EQUIPMENT REPORTS (admin/receptionist)
export const fetchAllEquipmentReportsService = async () => {

    return await getAllEquipmentReports();

};
