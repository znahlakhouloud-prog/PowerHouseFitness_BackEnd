import db from "../config/database.js";

export const getAllNotifications = async () => {

    const sql = `
        SELECT
            n.*,
            u.user_name
        FROM notification n
        JOIN user u ON n.id_user = u.id
        ORDER BY n.created_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

export const getNotificationById = async (id) => {

    const sql = `
        SELECT
            n.*,
            u.user_name
        FROM notification n
        JOIN user u ON n.id_user = u.id
        WHERE n.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

export const getNotificationsByUserId = async (id_user) => {

    const sql = `
        SELECT *
        FROM notification
        WHERE id_user = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [id_user]);

    return rows;
};

export const createNotification = async (notificationData) => {

    const sql = `
        INSERT INTO notification
        (id_user,title,descrip,is_read,type)
        VALUES (?,?,?,?,?)
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

export const deleteNotification = async (id) => {

    const sql = `
        DELETE FROM notification
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};