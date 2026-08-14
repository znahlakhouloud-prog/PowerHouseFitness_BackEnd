import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../auth/context/authContext.js";


function RoleRoute({ allowedRoles }) {

    const {
        user,
        token
    } = useContext(AuthContext);

    // Not authenticated
    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Must change temporary password first
    if (user.must_change_password === 1) {

        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    // Wrong role
    if (!allowedRoles.includes(user.role)) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RoleRoute;