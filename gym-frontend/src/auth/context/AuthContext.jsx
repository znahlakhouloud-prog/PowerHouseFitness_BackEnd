import { useState } from "react";

import { AuthContext } from "./authContext.js";


const isTokenExpired = (token) => {

    if (!token) {
        return true;
    }

    try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        return !payload.exp || payload.exp * 1000 < Date.now();

    } catch {

        return true;

    }
};

const getStoredAuth = () => {

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser || isTokenExpired(savedToken)) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return { token: null, user: null };
    }

    return { token: savedToken, user: JSON.parse(savedUser) };
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        () => getStoredAuth().user
    );
    const [token, setToken] = useState(
        () => getStoredAuth().token
    );

    //  Login
    const login = (userData, jwtToken) => {

        localStorage.setItem(
            "token",
             jwtToken
    );
        localStorage.setItem(
        "user",
        JSON.stringify(userData)
    );
        setToken(jwtToken);
        setUser(userData);
    };

    // UPDATE USER
    const updateUser = (updatedData) => {

        const updatedUser = {
            ...user,
            ...updatedData
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    }
    //   Logout
    const logout = () => {

        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear React state
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                updateUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};