import {
    getAllReportsService,
    getReportByIdService,
    generateReportService,
    deleteReportService,
    getDashboardAnalyticsService
} from "../services/reportService.js";

//    GET ALL REPORTS
export const fetchReports = async (req, res) => {

    try {

        const reports =
            await getAllReportsService();

        res.json(reports);

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

//    GET REPORT BY ID
export const fetchReportById = async (req, res) => {

    try {

        const report =
            await getReportByIdService(req.params.id);

        res.json(report);

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

//    GENERATE REPORT
export const generateReport = async (req, res) => {

    try {

        const result =
            await generateReportService();

        res.status(201).json({

            message: "Report generated successfully",

            id: result.insertId

        });

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

//    DELETE REPORT
export const removeReport = async (req, res) => {

    try {

        await deleteReportService(req.params.id);

        res.json({
            message: "Report deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// =========================================
// DASHBOARD ANALYTICS
// =========================================

export const getDashboardAnalytics = async (
    req,
    res
) => {

    try {

        const analytics =
            await getDashboardAnalyticsService();

        res.status(200).json(
            analytics
        );

    } catch (error) {

        console.error(error);

        res.status(
            error.status || 500
        ).json({

            message:
                error.message

        });

    }

};