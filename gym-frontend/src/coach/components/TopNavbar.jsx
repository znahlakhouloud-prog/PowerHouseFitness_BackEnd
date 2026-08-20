import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Menu,
    X,
    Dumbbell,
    User,
    LogOut,
    ChevronDown
} from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";
import NotificationBell from "../../shared/components/notifications/NotificationBell";

const TopNavbar = ({ isSidebarOpen, onToggleSidebar }) => {

    const {
        user,
        logout
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });

    };

    return (

        <header className="coach-navbar">

            <div className="navbar-left">

                <button
                    className="menu-button"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    aria-expanded={isSidebarOpen}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <button
                    type="button"
                    className="navbar-logo"
                    onClick={() => navigate("/coach")}
                >

                    <span className="navbar-logo-icon">
                        <Dumbbell size={18} />
                    </span>

                    <span className="navbar-logo-text">
                        PowerHouse<span className="navbar-logo-suffix"> Fitness</span>
                    </span>

                </button>

            </div>


            <div className="navbar-right">

                <NotificationBell />

                <div className="profile-container">

                    <button
                        className="profile"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >

                        <div className="profile-avatar">
                            <User size={19} />
                        </div>

                        <div className="profile-info">

                            <strong>
                                {user?.user_name || "Coach"}
                            </strong>

                            <span>
                                {user?.role || "coach"}
                            </span>

                        </div>

                        <ChevronDown size={16} />

                    </button>

                    {menuOpen && (

                        <div className="profile-dropdown">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/coach/profile");
                                }}
                            >
                                <User size={16} />
                                Profile
                            </button>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
};

export default TopNavbar;
