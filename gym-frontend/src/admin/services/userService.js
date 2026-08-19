import api from "../../services/api";


// GET ALL USERS
export const getUsers = async () => {

    const response = await api.get(
        "/users"
    );

    return response.data;
};


// UPDATE USER
export const updateUser = async (
    id,
    data
) => {

    const response = await api.put(
        `/users/${id}`,
        data
    );

    return response.data;
};


// DELETE USER
export const deleteUser = async (
    id
) => {

    const response = await api.delete(
        `/users/${id}`
    );

    return response.data;
};


// GET MY PROFILE
export const getMe = async (id) => {

    const response = await api.get(
        `/users/${id}`
    );

    return response.data;
};


// UPDATE MY PROFILE (name/age/email only - role can never be changed here)
export const updateMe = async (data) => {

    const response = await api.put(
        "/users/me",
        data
    );

    return response.data;
};
