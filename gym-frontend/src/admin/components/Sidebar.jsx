import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserPlus,
    Dumbbell,
    CreditCard,
    BadgeDollarSign,
    BarChart3,
    User,
    LogOut,
    X
} from "lucide-react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/authContext";

const navLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

const Sidebar = ({
    isOpen,
    setIsOpen
}) => {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });

    };

    return (
        <>

            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`admin-sidebar ${
                    isOpen ? "open" : ""
                }`}
            >

                <div className="sidebar-header">

                    <div className="sidebar-logo">
                        <span className="sidebar-logo-icon">
                            <Dumbbell size={20} />
                        </span>

                        <span>
                            PowerHouse
                        </span>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={22} />
                    </button>

                </div>


                <nav className="sidebar-nav">

                    <NavLink
                        to="/admin"
                        end
                        className={navLinkClass}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>


                    <NavLink
                        to="/admin/users"
                        end
                        className={navLinkClass}
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>


                    <NavLink
                        to="/admin/users/new"
                        className={navLinkClass}
                    >
                        <UserPlus size={20} />
                        <span>Register User</span>
                    </NavLink>


                    <NavLink
                        to="/admin/memberships"
                        className={navLinkClass}
                    >
                        <BadgeDollarSign size={20} />
                        <span>Memberships</span>
                    </NavLink>


                    <NavLink
                        to="/admin/payments"
                        className={navLinkClass}
                    >
                        <CreditCard size={20} />
                        <span>Payments</span>
                    </NavLink>


                    <NavLink
                        to="/admin/equipment"
                        className={navLinkClass}
                    >
                        <Dumbbell size={20} />
                        <span>Equipment</span>
                    </NavLink>


                    <NavLink
                        to="/admin/reports"
                        className={navLinkClass}
                    >
                        <BarChart3 size={20} />
                        <span>Reports & Analytics</span>
                    </NavLink>


                    <NavLink
                        to="/admin/profile"
                        className={navLinkClass}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </NavLink>

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="sidebar-link sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>

        </>
    );
};

export default Sidebar;
