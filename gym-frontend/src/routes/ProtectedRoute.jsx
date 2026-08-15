import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../auth/context/authContext";


function ProtectedRoute({ allowedRoles }) {

    const {
        user,
        token
    } = useContext(AuthContext);


    // No authentication
    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // Role not allowed
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return <Outlet />;
}


export default ProtectedRoute;