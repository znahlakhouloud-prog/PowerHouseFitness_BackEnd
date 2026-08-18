import api from "../../services/api";


// GET ALL ATTENDANCE RECORDS
export const getAttendances = async () => {

    const response = await api.get(
        "/attendance"
    );

    return response.data;
};
