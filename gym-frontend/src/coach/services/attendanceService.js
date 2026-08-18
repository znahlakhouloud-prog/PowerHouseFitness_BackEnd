import api from "../../services/api";


// GET MY ATTENDANCE HISTORY
export const getMyAttendance = async (id_user) => {

    const response = await api.get(
        `/attendance/user/${id_user}`
    );

    return response.data;
};
