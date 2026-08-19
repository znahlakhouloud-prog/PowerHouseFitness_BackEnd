import {
    createEquipmentReportService,
    fetchMyEquipmentReportsService,
    fetchAllEquipmentReportsService
} from "../services/equipmentReportService.js";

// CREATE EQUIPMENT REPORT
export const addEquipmentReport = async (req, res) => {

    try {

        const result = await createEquipmentReportService(
            req.user.id,
            req.body
        );

        res.status(201).json({
            message: "Equipment report submitted successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET MY EQUIPMENT REPORTS
export const fetchMyEquipmentReports = async (req, res) => {

    try {

        const reports = await fetchMyEquipmentReportsService(
            req.user.id
        );

        res.json(reports);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET ALL EQUIPMENT REPORTS (admin/receptionist)
export const fetchAllEquipmentReports = async (req, res) => {

    try {

        const reports = await fetchAllEquipmentReportsService();

        res.json(reports);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
