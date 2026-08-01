import { getUserById } from "../models/user.js";

import { createNotification } from "../models/notification.js";

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