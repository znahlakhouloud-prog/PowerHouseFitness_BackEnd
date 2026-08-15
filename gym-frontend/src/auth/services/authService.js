import api from "../../services/api";


// LOGIN
export const loginUser = async (
    email,
    password
) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password
        }
    );

    return response.data;
};


// CHANGE PASSWORD
export const changePassword = async (
    oldPassword,
    newPassword
) => {

    const response = await api.patch(
        "/auth/change-password",
        {
            oldPassword,
            newPassword
        }
    );

    return response.data;
};


// REGISTER
export const registerUser = async (
    userData
) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};


// FORGOT PASSWORD
export const forgotPassword = async (
    email
) => {

    const response = await api.post(
        "/auth/forgot-password",
        {
            email
        }
    );

    return response.data;
};


// RESET PASSWORD
export const resetPassword = async (
    token,
    newPassword
) => {

    const response = await api.patch(
        "/auth/reset-password",
        {
            token,
            newPassword
        }
    );

    return response.data;
};