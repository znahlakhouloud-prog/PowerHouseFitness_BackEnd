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

        // A 401 from these two endpoints means "wrong credentials" -
        // a normal, user-correctable input error the calling page
        // already handles inline. It does NOT mean the session is
        // invalid, so it must not trigger a forced logout/redirect.
        const isExpectedAuthFailure =
            error.config?.url?.includes("/auth/login") ||
            error.config?.url?.includes("/auth/change-password");

        if (error.response?.status === 401 && !isExpectedAuthFailure) {

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