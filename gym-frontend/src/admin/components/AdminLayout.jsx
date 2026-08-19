
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "../style/admin.css";

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className="admin-layout">

            <Navbar
                isSidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
            />

            <div className="admin-body">

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main
                    className={
                        sidebarOpen
                            ? "admin-content"
                            : "admin-content sidebar-closed"
                    }
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;