import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

const PAGE_TITLES = {
    "/admin": "Dashboard",
    "/admin/users": "Users",
    "/admin/users/new": "Register User",
    "/admin/memberships": "Memberships",
    "/admin/payments": "Payments",
    "/admin/equipment": "Equipment",
    "/admin/reports": "Reports & Analytics",
    "/admin/profile": "Profile"
};

const getPageTitle = (pathname) =>
    PAGE_TITLES[pathname] || "Dashboard";

const TopNavbar = ({ isSidebarOpen, onToggleSidebar }) => {

    const {
        user,
        logout
    } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });

    };

    return (

        <header className="admin-navbar">

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
                    onClick={() => navigate("/admin")}
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

                <h1 className="navbar-page-title">
                    {getPageTitle(location.pathname)}
                </h1>

                <NotificationBell />

                <div className="profile-container">

                    <button
                        className="profile-button"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >

                        <div className="avatar">
                            <User size={18} />
                        </div>

                        <div className="profile-info">

                            <strong>
                                {user?.user_name || "Admin"}
                            </strong>

                            <small>
                                Administrator
                            </small>

                        </div>

                        <ChevronDown size={16} />

                    </button>

                    {menuOpen && (

                        <div className="profile-dropdown">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/admin/profile");
                                }}
                            >
                                <User size={16} style={{ marginRight: 8 }} />
                                Profile
                            </button>

                            <hr />

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} style={{ marginRight: 8 }} />
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
