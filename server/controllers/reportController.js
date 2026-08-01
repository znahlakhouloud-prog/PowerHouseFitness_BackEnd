import {
    getAllReports,
    getReportById,
    deleteReport } from "../models/report.js";

import { generateReportService } from "../services/reportService.js";

export const fetchReports = async (req, res) => {

    try {

        const reports = await getAllReports();

        res.json(reports);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchReportById = async (req, res) => {

    try {

        const report = await getReportById(req.params.id);

        if (report.length === 0) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        res.json(report[0]);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const generateReport = async (req, res) => {

    try {

        const result = await generateReportService();

        res.status(201).json({
            message: "Report generated successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

export const removeReport = async (req, res) => {

    try {

        const result = await deleteReport(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        res.json({
            message: "Report deleted successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};