import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserPlus,
    BadgeDollarSign,
    CalendarCheck,
    Wrench,
    Bell,
    User,
    LogOut,
    Dumbbell,
    X
} from "lucide-react";

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
        <aside
            className={`receptionist-sidebar ${
                isOpen ? "open" : ""
            }`}
        >

            <div className="sidebar-header">

                <div className="sidebar-logo">
                    <Dumbbell size={28} />

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
                    to="/receptionist"
                    end
                    className={navLinkClass}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/receptionist/members"
                    className={navLinkClass}
                >
                    <Users size={20} />
                    <span>Members</span>
                </NavLink>

                <NavLink
                    to="/receptionist/members/new"
                    className={navLinkClass}
                >
                    <UserPlus size={20} />
                    <span>Register Member</span>
                </NavLink>

                <NavLink
                    to="/receptionist/memberships"
                    className={navLinkClass}
                >
                    <BadgeDollarSign size={20} />
                    <span>Memberships</span>
                </NavLink>

                <NavLink
                    to="/receptionist/attendance"
                    className={navLinkClass}
                >
                    <CalendarCheck size={20} />
                    <span>Attendance</span>
                </NavLink>

                <NavLink
                    to="/receptionist/equipment"
                    className={navLinkClass}
                >
                    <Wrench size={20} />
                    <span>Equipment</span>
                </NavLink>

                <NavLink
                    to="/receptionist/notifications"
                    className={navLinkClass}
                >
                    <Bell size={20} />
                    <span>Notifications</span>
                </NavLink>

                <NavLink
                    to="/receptionist/profile"
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
    );
};

export default Sidebar;
