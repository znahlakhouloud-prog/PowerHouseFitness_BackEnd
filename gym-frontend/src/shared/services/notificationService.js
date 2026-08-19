import api from "../../services/api";


// GET MY NOTIFICATIONS
export const getMyNotifications = async (id_user) => {

    const response = await api.get(
        `/notifications/user/${id_user}`
    );

    return response.data;
};


// GET MY UNREAD COUNT
export const getUnreadCount = async () => {

    const response = await api.get(
        "/notifications/unread-count"
    );

    return response.data.count;
};


// MARK ONE AS READ
export const markAsRead = async (id) => {

    const response = await api.patch(
        `/notifications/${id}/read`
    );

    return response.data;
};


// MARK ALL AS READ
export const markAllAsRead = async () => {

    const response = await api.patch(
        "/notifications/read-all"
    );

    return response.data;
};
