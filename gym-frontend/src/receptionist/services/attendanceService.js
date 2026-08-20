import api from "../../services/api";


// GET ALL ATTENDANCE RECORDS
export const getAttendances = async () => {

    const response = await api.get(
        "/attendance"
    );

    return response.data;
};


// CHECK IN A MEMBER (admin/receptionist only - backend rejects if the
// member has no active membership or has already checked in today)
export const checkInMember = async (id_user) => {

    const response = await api.post(
        "/attendance/check-in",
        { id_user }
    );

    return response.data;
};
