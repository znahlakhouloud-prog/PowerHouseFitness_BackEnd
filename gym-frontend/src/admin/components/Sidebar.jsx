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
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    CreditCard,
    BadgeDollarSign,
    BarChart3,
    X
} from "lucide-react";

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

                <a
                    href="/admin"
                    className="sidebar-link active"
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </a>


                <a
                    href="/admin/users"
                    className="sidebar-link"
                >
                    <Users size={20} />
                    <span>Users</span>
                </a>


                <a
                    href="/admin/equipment"
                    className="sidebar-link"
                >
                    <Dumbbell size={20} />
                    <span>Equipment</span>
                </a>


                <a
                    href="/admin/payments"
                    className="sidebar-link"
                >
                    <CreditCard size={20} />
                    <span>Payments</span>
                </a>


                <a
                    href="/admin/memberships"
                    className="sidebar-link"
                >
                    <BadgeDollarSign size={20} />
                    <span>Memberships</span>
                </a>


                <a
                    href="/admin/reports"
                    className="sidebar-link"
                >
                    <BarChart3 size={20} />
                    <span>Reports & Analytics</span>
                </a>

            </nav>

        </aside>
    );
};

export default Sidebar;