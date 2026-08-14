import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Landing from "../landing/pages/Landing";
import Login from "../auth/pages/Login";
import Register from "../auth/pages/Register";
import ChangePassword from "../auth/pages/ChangePassword";
import ForgotPassword from "../auth/pages/ForgotPassword";
import ResetPassword from "../auth/pages/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LogoutButton from "../components/LogoutButton";

function AdminPage() {

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <LogoutButton />
        </div>
    );
}

function EmployeePage() {
    return (
        <div>
            <h1>Employee Dashboard</h1>
            <LogoutButton />
        </div>
    );
}

function CoachPage() {
    return (
        <div>
            <h1>Coach Dashboard</h1>
            <LogoutButton />
        </div>
    );
}

function MemberPage() {

    return (
        <div>
            <h1>Member Dashboard</h1>
            <LogoutButton />
        </div>
    );
}

function ReceptionistPage() {

    return (
        <div>
            <h1>Receptionist Dashboard</h1>
            <LogoutButton />
        </div>
    );
}


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* {PUBLIC ROUTES */}
                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* {AUTHENTICATION */}
                <Route
                    element={<ProtectedRoute />}
                >
                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />

                </Route>


                 {/* ADMIN */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["admin"]}
                        />
                    }
                >

                    <Route
                        path="/admin"
                        element={<AdminPage />}
                    />

                </Route>


                {/* {RECEPTIONIST */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["receptionist"]}
                        />
                    }
                >

                    <Route
                        path="/receptionist"
                        element={<ReceptionistPage />}
                    />

                </Route>


                {/* {EMPLOYEE */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["employee"]}
                        />
                    }
                >

                    <Route
                        path="/employee"
                        element={<EmployeePage />}
                    />

                </Route>


                {/* {COACH */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["coach"]}
                        />
                    }
                >

                    <Route
                        path="/coach"
                        element={<CoachPage />}
                    />

                </Route>


                {/* {MEMBER */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["member"]}
                        />
                    }
                >

                    <Route
                        path="/member"
                        element={<MemberPage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default AppRoutes;