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

import AdminLayout from "../admin/components/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import UsersPage from "../admin/pages/UsersPage";
import EquipmentPage from "../admin/pages/EquipmentPage";
import PaymentsPage from "../admin/pages/PaymentsPage";
import MembershipsPage from "../admin/pages/MembershipsPage";
import ReportsPage from "../admin/pages/ReportsPage";

import ReceptionistLayout from "../receptionist/components/ReceptionistLayout";
import ReceptionistDashboard from "../receptionist/pages/ReceptionistDashboard";
import MembersPage from "../receptionist/pages/MembersPage";
import RegisterMemberPage from "../receptionist/pages/RegisterMemberPage";
import MemberDetailsPage from "../receptionist/pages/MemberDetailsPage";
import ReceptionistMembershipsPage from "../receptionist/pages/MembershipsPage";
import AttendancePage from "../receptionist/pages/AttendancePage";
import ReceptionistEquipmentPage from "../receptionist/pages/EquipmentPage";
import NotificationsPage from "../receptionist/pages/NotificationsPage";
import ProfilePage from "../receptionist/pages/ProfilePage";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC
                ========================= */}

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =========================
                    AUTHENTICATED
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "employee",
                                "receptionist",
                                "coach",
                                "member"
                            ]}
                        />
                    }
                >

                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />

                </Route>


                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        />
                    }
                >

                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        <Route
                            index
                            element={
                                <AdminDashboard />
                            }
                        />

                        <Route
                            path="users"
                            element={
                                <UsersPage />
                            }
                        />

                        <Route
                            path="users/new"
                            element={
                                <Register />
                            }
                        />

                        <Route
                            path="equipment"
                            element={
                                <EquipmentPage />
                            }
                        />

                        <Route
                            path="payments"
                            element={
                                <PaymentsPage />
                            }
                        />

                        <Route
                            path="memberships"
                            element={
                                <MembershipsPage />
                            }
                        />

                        <Route
                            path="reports"
                            element={
                                <ReportsPage />
                            }
                        />

                    </Route>

                </Route>


                {/* =========================
                    EMPLOYEE
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["employee"]}
                        />
                    }
                >

                    <Route
                        path="/employee"
                        element={
                            <h1>
                                Employee Dashboard
                            </h1>
                        }
                    />

                </Route>


                {/* =========================
                    RECEPTIONIST
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["receptionist"]}
                        />
                    }
                >

                    <Route
                        path="/receptionist"
                        element={<ReceptionistLayout />}
                    >

                        <Route
                            index
                            element={
                                <ReceptionistDashboard />
                            }
                        />

                        <Route
                            path="members"
                            element={
                                <MembersPage />
                            }
                        />

                        <Route
                            path="members/new"
                            element={
                                <RegisterMemberPage />
                            }
                        />

                        <Route
                            path="members/:id"
                            element={
                                <MemberDetailsPage />
                            }
                        />

                        <Route
                            path="memberships"
                            element={
                                <ReceptionistMembershipsPage />
                            }
                        />

                        <Route
                            path="attendance"
                            element={
                                <AttendancePage />
                            }
                        />

                        <Route
                            path="equipment"
                            element={
                                <ReceptionistEquipmentPage />
                            }
                        />

                        <Route
                            path="notifications"
                            element={
                                <NotificationsPage />
                            }
                        />

                        <Route
                            path="profile"
                            element={
                                <ProfilePage />
                            }
                        />

                    </Route>

                </Route>


                {/* =========================
                    COACH
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["coach"]}
                        />
                    }
                >

                    <Route
                        path="/coach"
                        element={
                            <h1>
                                Coach Dashboard
                            </h1>
                        }
                    />

                </Route>


                {/* =========================
                    MEMBER
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["member"]}
                        />
                    }
                >

                    <Route
                        path="/member"
                        element={
                            <h1>
                                Member Dashboard
                            </h1>
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default AppRoutes;