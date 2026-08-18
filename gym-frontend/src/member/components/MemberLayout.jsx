import { useState } from "react";
import { Outlet } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "../style/member.css";

function MemberLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="member-layout">

            <TopNavbar
                setIsOpen={setSidebarOpen}
            />

            <div className="member-body">

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main
                    className={
                        sidebarOpen
                            ? "member-content"
                            : "member-content sidebar-closed"
                    }
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MemberLayout;
