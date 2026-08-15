import api from "../../services/api";


// ========================================
// GET ALL USERS
// ========================================

export const getUsers = async () => {

    const response = await api.get(
        "/users"
    );

    return response.data;
};


// ========================================
// GET USER BY ID
// ========================================

export const getUserById = async (id) => {

    const response = await api.get(
        `/users/${id}`
    );

    return response.data;
};


// ========================================
// UPDATE USER
// ========================================

export const updateUser = async (
    id,
    userData
) => {

    const response = await api.patch(
        `/users/${id}`,
        userData
    );

    return response.data;
};


// ========================================
// DELETE USER
// ========================================

export const deleteUser = async (id) => {

    const response = await api.delete(
        `/users/${id}`
    );

    return response.data;
};