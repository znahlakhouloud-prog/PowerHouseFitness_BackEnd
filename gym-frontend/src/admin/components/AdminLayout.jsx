
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "../style/admin.css";

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="admin-layout">

            <Navbar
                setIsOpen={setSidebarOpen}
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