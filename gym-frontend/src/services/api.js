import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json"
    }
});


// ========================================
// REQUEST INTERCEPTOR
// Automatically attach JWT
// ========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }

);


// ========================================
// RESPONSE INTERCEPTOR
// Handle expired / invalid JWT
// ========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (error.response?.status === 401) {

            // Remove authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login
            window.location.href = "/login";

        }

        return Promise.reject(error);

    }

);


export default api;