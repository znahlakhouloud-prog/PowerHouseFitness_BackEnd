import db from "../config/database.js";

// GET ALL NOTIFICATIONS
export const getAllNotifications = async () => {

    const sql = `
        SELECT
            n.id,
            n.id_user,
            u.user_name,
            n.title,
            n.descrip,
            n.is_read,
            n.created_at,
            n.type
        FROM notification n
        JOIN user u
            ON n.id_user = u.id
        ORDER BY n.created_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;

};

// GET NOTIFICATION BY ID
export const getNotificationById = async (id) => {

    const sql = `
        SELECT
            n.id,
            n.id_user,
            u.user_name,
            n.title,
            n.descrip,
            n.is_read,
            n.created_at,
            n.type
        FROM notification n
        JOIN user u
            ON n.id_user = u.id
        WHERE n.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;

};

// GET USER NOTIFICATIONS
export const getNotificationsByUserId = async (id_user) => {

    const sql = `
        SELECT
            id,
            id_user,
            title,
            descrip,
            is_read,
            created_at,
            type
        FROM notification
        WHERE id_user = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;

};

// CREATE NOTIFICATION
export const createNotification = async (notificationData) => {

    const sql = `
        INSERT INTO notification
        (
            id_user,
            title,
            descrip,
            is_read,
            type
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        notificationData.id_user,
        notificationData.title,
        notificationData.descrip,
        notificationData.is_read,
        notificationData.type
    ];

    const [result] = await db.query(sql, values);

    return result;

};

// UPDATE NOTIFICATION
export const updateNotification = async (id, notificationData) => {

    const sql = `
        UPDATE notification
        SET
            title = ?,
            descrip = ?,
            type = ?
        WHERE id = ?
    `;

    const values = [
        notificationData.title,
        notificationData.descrip,
        notificationData.type,
        id
    ];

    const [result] = await db.query(sql, values);

    return result;

};

// DELETE NOTIFICATION
export const deleteNotification = async (id) => {

    const sql = `
        DELETE FROM notification
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;

};

// MARK AS READ
export const markNotificationAsRead = async (id) => {

    const sql = `
        UPDATE notification
        SET is_read = true
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;

};

// UNREAD COUNT FOR ONE USER
export const getUnreadCountByUserId = async (id_user) => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM notification
        WHERE id_user = ?
        AND is_read = false
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows[0].total;

};

// MARK ALL AS READ FOR ONE USER
export const markAllAsReadByUserId = async (id_user) => {

    const sql = `
        UPDATE notification
        SET is_read = true
        WHERE id_user = ?
        AND is_read = false
    `;

    const [result] = await db.query(sql, [id_user]);

    return result;

};