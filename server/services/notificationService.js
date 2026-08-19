import {
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserId,
    createNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    getUnreadCountByUserId,
    markAllAsReadByUserId
} from "../models/notification.js";

import { getUserById, getAdminUserIds } from "../models/user.js";


// GET ALL NOTIFICATIONS
export const fetchNotificationsService = async () => {

    return await getAllNotifications();

};

// GET NOTIFICATION BY ID
export const fetchNotificationByIdService = async (id) => {

    const notifications = await getNotificationById(id);

    if (notifications.length === 0) {

        const error = new Error("Notification not found");
        error.status = 404;
        throw error;

    }

    return notifications[0];

};

// GET USER NOTIFICATIONS
export const fetchNotificationsByUserIdService = async (id_user) => {

    const user = await getUserById(id_user);

    if (user.length === 0) {

        const error = new Error("User not found");
        error.status = 404;
        throw error;

    }

    return await getNotificationsByUserId(id_user);

};

// CREATE NOTIFICATION
export const createNotificationService = async (data) => {

    const user = await getUserById(data.id_user);

    if (user.length === 0) {

        const error = new Error("User not found");
        error.status = 404;
        throw error;

    }

    const notificationData = {

        ...data,

        is_read: false

    };

    return await createNotification(notificationData);

};

// UPDATE NOTIFICATION
export const updateNotificationService = async (id, data) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {

        const error = new Error("Notification not found");
        error.status = 404;
        throw error;

    }

    return await updateNotification(id, data);

};

// DELETE NOTIFICATION
export const deleteNotificationService = async (id) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {

        const error = new Error("Notification not found");
        error.status = 404;
        throw error;

    }

    return await deleteNotification(id);

};

// MARK NOTIFICATION AS READ
export const markNotificationAsReadService = async (id) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {

        const error = new Error("Notification not found");
        error.status = 404;
        throw error;

    }

    return await markNotificationAsRead(id);

};

// UNREAD COUNT
export const fetchUnreadCountService = async (id_user) => {

    return await getUnreadCountByUserId(id_user);

};

// MARK ALL AS READ
export const markAllAsReadService = async (id_user) => {

    return await markAllAsReadByUserId(id_user);

};

// NOTIFY ALL ADMINS (fan-out - one row per admin, so each admin's
// read state is independent rather than sharing a single row)
export const notifyAdmins = async ({ title, descrip, type }) => {

    const adminIds = await getAdminUserIds();

    for (const id_user of adminIds) {

        await createNotification({
            id_user,
            title,
            descrip,
            is_read: false,
            type
        });

    }

};