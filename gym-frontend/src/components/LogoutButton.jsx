import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../auth/context/authContext.js";

function LogoutButton() {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}

export default LogoutButton;