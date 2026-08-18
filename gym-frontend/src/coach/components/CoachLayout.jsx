import { useState } from "react";
import { Outlet } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "../style/coach.css";

function CoachLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="coach-layout">

            <TopNavbar
                setIsOpen={setSidebarOpen}
            />

            <div className="coach-body">

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main
                    className={
                        sidebarOpen
                            ? "coach-content"
                            : "coach-content sidebar-closed"
                    }
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default CoachLayout;
