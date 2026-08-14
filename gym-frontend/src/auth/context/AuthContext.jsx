import { useState } from "react";

import { AuthContext } from "./authContext.js";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });
    const [token, setToken] = useState(
        localStorage.getItem("token")
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