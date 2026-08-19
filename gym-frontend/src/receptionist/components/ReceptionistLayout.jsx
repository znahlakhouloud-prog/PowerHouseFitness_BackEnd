import { useState } from "react";
import { Outlet } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "../style/receptionist.css";

function ReceptionistLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className="receptionist-layout">

            <TopNavbar
                isSidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
            />

            <div className="receptionist-body">

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main
                    className={
                        sidebarOpen
                            ? "receptionist-content"
                            : "receptionist-content sidebar-closed"
                    }
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default ReceptionistLayout;
