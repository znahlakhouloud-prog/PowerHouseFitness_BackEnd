import api from "../../services/api";


// GET NOTIFICATIONS FOR A USER
export const getNotificationsByUser = async (
    id_user
) => {

    const response = await api.get(
        `/notifications/user/${id_user}`
    );

    return response.data;
};


// MARK NOTIFICATION AS READ
export const markNotificationAsRead = async (
    id
) => {

    const response = await api.patch(
        `/notifications/${id}/read`
    );

    return response.data;
};
