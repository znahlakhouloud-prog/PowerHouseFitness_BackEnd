// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { AuthContext } from "../../auth/context/authContext";

// function Navbar({ onMenuClick }) {

//     const navigate = useNavigate();

//     const { user, logout } =
//         useContext(AuthContext);

//     const [profileOpen, setProfileOpen] =
//         useState(false);

//     const handleLogout = () => {

//         logout();

//         navigate("/login");
//     };

//     return (
//         <header className="admin-navbar">

//             {/* LEFT */}

//             <div className="navbar-left">

//                 <button
//                     className="menu-button"
//                     onClick={onMenuClick}
//                     aria-label="Toggle sidebar"
//                 >
//                     ☰
//                 </button>


//                 <div
//                     className="navbar-logo"
//                     onClick={() =>
//                         navigate("/admin")
//                     }
//                 >
//                     PowerHouse
//                     <span>Fitness</span>
//                 </div>

//             </div>


//             {/* SEARCH */}

//             <div className="navbar-search">

//                 <span>⌕</span>

//                 <input
//                     type="text"
//                     placeholder="Search..."
//                 />

//                 <kbd>Ctrl K</kbd>

//             </div>


//             {/* RIGHT */}

//             <div className="navbar-right">

//                 <button
//                     className="navbar-icon"
//                     title="Notifications"
//                 >
//                     🔔
//                 </button>


//                 <button
//                     className="navbar-icon"
//                     title="Messages"
//                 >
//                     💬
//                 </button>


//                 <div className="profile-container">

//                     <button
//                         className="profile-button"
//                         onClick={() =>
//                             setProfileOpen(
//                                 !profileOpen
//                             )
//                         }
//                     >

//                         <div className="avatar">
//                             {user?.user_name
//                                 ?.charAt(0)
//                                 .toUpperCase() || "A"}
//                         </div>


//                         <div className="profile-info">

//                             <strong>
//                                 {user?.user_name ||
//                                     "Administrator"}
//                             </strong>

//                             <small>
//                                 Administrator
//                             </small>

//                         </div>

//                         <span>⌄</span>

//                     </button>


//                     {profileOpen && (

//                         <div className="profile-dropdown">

//                             <button
//                                 onClick={() =>
//                                     navigate(
//                                         "/admin/profile"
//                                     )
//                                 }
//                             >
//                                 👤 Profile
//                             </button>


//                             <button
//                                 onClick={() =>
//                                     navigate(
//                                         "/admin/settings"
//                                     )
//                                 }
//                             >
//                                 ⚙ Settings
//                             </button>


//                             <hr />


//                             <button
//                                 className="logout-button"
//                                 onClick={handleLogout}
//                             >
//                                 ↪ Logout
//                             </button>

//                         </div>

//                     )}

//                 </div>

//             </div>

//         </header>
//     );
// }

// export default Navbar;
import {
    Menu,
    Search,
    Bell,
    MessageCircle,
    User,
    LogOut
} from "lucide-react";

import { useContext } from "react";
import { AuthContext } from "../../auth/context/authContext";

const TopNavbar = ({ setIsOpen }) => {

    const {
        user,
        logout
    } = useContext(AuthContext);

    return (

        <header className="admin-navbar">

            <div className="navbar-left">

                <button
                    className="menu-button"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu size={24} />
                </button>


                <div className="search-box">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

            </div>


            <div className="navbar-right">

                <button className="navbar-icon">
                    <Bell size={21} />

                    <span className="notification-dot" />
                </button>


                <button className="navbar-icon">
                    <MessageCircle size={21} />
                </button>


                <div className="profile">

                    <div className="profile-avatar">
                        <User size={19} />
                    </div>

                    <div className="profile-info">

                        <strong>
                            {user?.user_name || "Admin"}
                        </strong>

                        <span>
                            {user?.role || "admin"}
                        </span>

                    </div>


                    <button
                        className="logout-button"
                        onClick={logout}
                        title="Logout"
                    >
                        <LogOut size={19} />
                    </button>

                </div>

            </div>

        </header>
    );
};

export default TopNavbar;