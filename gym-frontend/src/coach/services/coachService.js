import api from "../../services/api";


// GET MY PROFILE
export const getMe = async (id) => {

    const response = await api.get(
        `/users/${id}`
    );

    return response.data;
};


// UPDATE MY PROFILE (name only - email/birth_date/role can never be changed here)
export const updateMe = async (data) => {

    const response = await api.put(
        "/users/me",
        data
    );

    return response.data;
};
