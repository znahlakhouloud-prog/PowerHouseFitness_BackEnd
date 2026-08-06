import {
    fetchNotificationsService,
    fetchNotificationByIdService,
    fetchNotificationsByUserIdService,
    createNotificationService,
    updateNotificationService,
    deleteNotificationService,
    markNotificationAsReadService
} from "../services/notificationService.js";

// GET ALL NOTIFICATIONS
export const fetchNotifications = async (req, res) => {

    try {

        const notifications =
            await fetchNotificationsService();

        res.json(notifications);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET NOTIFICATION BY ID
export const fetchNotificationById = async (req, res) => {

    try {

        const notification =
            await fetchNotificationByIdService(req.params.id);

        res.json(notification);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// GET USER NOTIFICATIONS
export const fetchNotificationsByUserId = async (req, res) => {

    try {

        const notifications =
            await fetchNotificationsByUserIdService(req.params.id_user);

        res.json(notifications);

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// CREATE NOTIFICATION
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

// UPDATE NOTIFICATION
export const editNotification = async (req, res) => {

    try {

        await updateNotificationService(
            req.params.id,
            req.body
        );

        res.json({
            message: "Notification updated successfully"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// DELETE NOTIFICATION
export const removeNotification = async (req, res) => {

    try {

        await deleteNotificationService(req.params.id);

        res.json({
            message: "Notification deleted successfully"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};

// MARK AS READ
export const readNotification = async (req, res) => {

    try {

        await markNotificationAsReadService(req.params.id);

        res.json({
            message: "Notification marked as read"
        });

    } catch (error) {

        res.status(error.status || 500).json({
            message: error.message
        });

    }

};