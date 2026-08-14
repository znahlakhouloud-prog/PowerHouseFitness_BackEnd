import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../auth/context/authContext.js";


function ProtectedRoute() {

    const {
        token,
        user
    } = useContext(AuthContext);

    const location = useLocation();

    // Not logged in
    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // User must change temporary password
    if (
        user.must_change_password === 1 &&
        location.pathname !== "/change-password"
    ) {

        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;