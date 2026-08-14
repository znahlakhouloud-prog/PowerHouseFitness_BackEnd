import axios from "axios";

const API_URL = "http://localhost:3000";

// Login
export const loginUser = async (email, password) => {

    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            email,
            password
        }
    );

    return response.data;
};

// Change password
export const changePassword = async (
    oldPassword,
    newPassword,
    token
) => {

    const response = await axios.patch(
        `${API_URL}/auth/change-password`,
        {
            oldPassword,
            newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Register
export const registerUser = async (userData) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/auth/register`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {

    const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
    );

    return response.data;
};

export const resetPassword = async (
    token,
    newPassword
) => {

    const response = await axios.patch(
        `${API_URL}/auth/reset-password`,
        {
            token,
            newPassword
        }
    );

    return response.data;
};