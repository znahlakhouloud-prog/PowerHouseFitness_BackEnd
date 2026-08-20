import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    CalendarCheck,
    BadgeDollarSign,
    CreditCard,
    Wrench,
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
        <>

            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`member-sidebar ${
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
                        to="/member"
                        end
                        className={navLinkClass}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/member/attendance"
                        className={navLinkClass}
                    >
                        <CalendarCheck size={20} />
                        <span>My Attendance</span>
                    </NavLink>

                    <NavLink
                        to="/member/plans"
                        className={navLinkClass}
                    >
                        <BadgeDollarSign size={20} />
                        <span>Membership Plans</span>
                    </NavLink>

                    <NavLink
                        to="/member/payments"
                        className={navLinkClass}
                    >
                        <CreditCard size={20} />
                        <span>Payments</span>
                    </NavLink>

                    <NavLink
                        to="/member/equipment"
                        className={navLinkClass}
                    >
                        <Wrench size={20} />
                        <span>Equipment</span>
                    </NavLink>

                    <NavLink
                        to="/member/profile"
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
