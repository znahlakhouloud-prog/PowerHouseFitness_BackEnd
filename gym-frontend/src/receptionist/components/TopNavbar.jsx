import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Menu,
    Search,
    Bell,
    User,
    LogOut,
    ChevronDown
} from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

const TopNavbar = ({ setIsOpen }) => {

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

        <header className="receptionist-navbar">

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
                        placeholder="Search members..."
                    />

                </div>

            </div>


            <div className="navbar-right">

                <button className="navbar-icon">
                    <Bell size={21} />

                    <span className="notification-dot" />
                </button>


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
                                {user?.user_name || "Receptionist"}
                            </strong>

                            <span>
                                {user?.role || "receptionist"}
                            </span>

                        </div>

                        <ChevronDown size={16} />

                    </button>

                    {menuOpen && (

                        <div className="profile-dropdown">

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/receptionist/profile");
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
