import api from "../../services/api";


// GET ALL MEMBERS (server filters to role=member for receptionists)
export const getMembers = async () => {

    const response = await api.get(
        "/users"
    );

    return response.data;
};


// GET MEMBER BY ID
export const getMemberById = async (
    id
) => {

    const response = await api.get(
        `/users/${id}`
    );

    return response.data;
};
