import {
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserId,
    updateNotification,
    deleteNotification } from "../models/notification.js";

import { createNotificationService } from "../services/notificationService.js";

export const fetchNotifications = async (req, res) => {

    try {

        const notifications = await getAllNotifications();

        res.json(notifications);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchNotificationById = async (req, res) => {

    try {

        const notification = await getNotificationById(req.params.id);

        if (notification.length === 0) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.json(notification[0]);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const fetchNotificationsByUserId = async (req, res) => {

    try {

        const notifications =
            await getNotificationsByUserId(req.params.id_user);

        res.json(notifications);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const addNotification = async (req, res) => {

    try {

        const result =
            await createNotificationService(req.body);

        res.status(201).json({
            message: "Notification created successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

export const editNotification = async (req, res) => {

    try {

        const result =
            await updateNotification(req.params.id, req.body);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.json({
            message: "Notification updated successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

export const removeNotification = async (req, res) => {

    try {

        const result =
            await deleteNotification(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.json({
            message: "Notification deleted successfully"
        });

    } catch (error) {

        res.status(500).json(error);

    }

};