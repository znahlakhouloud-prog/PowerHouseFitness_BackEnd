// import { NavLink } from "react-router-dom";

// function Sidebar({ isOpen }) {

//     const navigation = [

//         {
//             label: "MAIN",
//             items: [
//                 {
//                     name: "Dashboard",
//                     path: "/admin",
//                     icon: "▦"
//                 }
//             ]
//         },

//         {
//             label: "MANAGEMENT",
//             items: [
//                 {
//                     name: "Users",
//                     path: "/admin/users",
//                     icon: "♙"
//                 },
//                 {
//                     name: "Equipment",
//                     path: "/admin/equipment",
//                     icon: "▣"
//                 },
//                 {
//                     name: "Payments",
//                     path: "/admin/payments",
//                     icon: "$"
//                 },
//                 {
//                     name: "Membership",
//                     path: "/admin/memberships",
//                     icon: "▤"
//                 }
//             ]
//         },

//         {
//             label: "ANALYTICS",
//             items: [
//                 {
//                     name: "Reports & Analytics",
//                     path: "/admin/reports",
//                     icon: "◩"
//                 }
//             ]
//         }

//     ];


//     return (

//         <aside
//             className={
//                 isOpen
//                     ? "admin-sidebar"
//                     : "admin-sidebar closed"
//             }
//         >

//             <nav>

//                 {navigation.map(
//                     (section) => (

//                         <div
//                             className="sidebar-section"
//                             key={section.label}
//                         >

//                             <div className="sidebar-label">
//                                 {section.label}
//                             </div>


//                             {section.items.map(
//                                 (item) => (

//                                     <NavLink
//                                         key={item.path}
//                                         to={item.path}
//                                         end={
//                                             item.path ===
//                                             "/admin"
//                                         }
//                                         className={({
//                                             isActive
//                                         }) =>
//                                             isActive
//                                                 ? "sidebar-link active"
//                                                 : "sidebar-link"
//                                         }
//                                     >

//                                         <span className="sidebar-icon">
//                                             {item.icon}
//                                         </span>

//                                         <span className="sidebar-text">
//                                             {item.name}
//                                         </span>

//                                     </NavLink>

//                                 )
//                             )}

//                         </div>

//                     )
//                 )}

//             </nav>


//             <div className="sidebar-bottom">

//                 <NavLink
//                     to="/admin/settings"
//                     className="sidebar-link"
//                 >
//                     <span className="sidebar-icon">
//                         ⚙
//                     </span>

//                     <span className="sidebar-text">
//                         Settings
//                     </span>
//                 </NavLink>

//             </div>

//         </aside>
//     );
// }

// export default Sidebar;
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Dumbbell,
    CreditCard,
    BadgeDollarSign,
    BarChart3,
    X
} from "lucide-react";

const navLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

const Sidebar = ({
    isOpen,
    setIsOpen
}) => {

    return (
        <aside
            className={`admin-sidebar ${
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
                    to="/admin"
                    end
                    className={navLinkClass}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/admin/users"
                    className={navLinkClass}
                >
                    <Users size={20} />
                    <span>Users</span>
                </NavLink>


                <NavLink
                    to="/admin/equipment"
                    className={navLinkClass}
                >
                    <Dumbbell size={20} />
                    <span>Equipment</span>
                </NavLink>


                <NavLink
                    to="/admin/payments"
                    className={navLinkClass}
                >
                    <CreditCard size={20} />
                    <span>Payments</span>
                </NavLink>


                <NavLink
                    to="/admin/memberships"
                    className={navLinkClass}
                >
                    <BadgeDollarSign size={20} />
                    <span>Memberships</span>
                </NavLink>


                <NavLink
                    to="/admin/reports"
                    className={navLinkClass}
                >
                    <BarChart3 size={20} />
                    <span>Reports & Analytics</span>
                </NavLink>

            </nav>

        </aside>
    );
};

export default Sidebar;