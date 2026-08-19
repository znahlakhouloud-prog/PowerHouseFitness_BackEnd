import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Landing from "../landing/pages/Landing";

import Login from "../auth/pages/Login";
import ChangePassword from "../auth/pages/ChangePassword";
import ForgotPassword from "../auth/pages/ForgotPassword";
import ResetPassword from "../auth/pages/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../admin/components/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import UsersPage from "../admin/pages/UsersPage";
import RegisterUserPage from "../admin/pages/RegisterUserPage";
import EquipmentPage from "../admin/pages/EquipmentPage";
import PaymentsPage from "../admin/pages/PaymentsPage";
import MembershipsPage from "../admin/pages/MembershipsPage";
import ReportsPage from "../admin/pages/ReportsPage";
import AdminProfile from "../admin/pages/AdminProfile";

import ReceptionistLayout from "../receptionist/components/ReceptionistLayout";
import ReceptionistDashboard from "../receptionist/pages/ReceptionistDashboard";
import MembersPage from "../receptionist/pages/MembersPage";
import RegisterMemberPage from "../receptionist/pages/RegisterMemberPage";
import MemberDetailsPage from "../receptionist/pages/MemberDetailsPage";
import ReceptionistMembershipsPage from "../receptionist/pages/MembershipsPage";
import AttendancePage from "../receptionist/pages/AttendancePage";
import ReceptionistEquipmentPage from "../receptionist/pages/EquipmentPage";
import ProfilePage from "../receptionist/pages/ProfilePage";

import MemberLayout from "../member/components/MemberLayout";
import MemberDashboard from "../member/pages/MemberDashboard";
import MemberAttendancePage from "../member/pages/AttendancePage";
import MembershipPlansPage from "../member/pages/MembershipPlansPage";
import MemberPaymentsPage from "../member/pages/PaymentsPage";
import MemberEquipmentPage from "../member/pages/EquipmentPage";
import MemberProfilePage from "../member/pages/ProfilePage";

import CoachLayout from "../coach/components/CoachLayout";
import CoachDashboard from "../coach/pages/CoachDashboard";
import CoachAttendancePage from "../coach/pages/AttendancePage";
import CoachEquipmentPage from "../coach/pages/EquipmentPage";
import CoachProfilePage from "../coach/pages/ProfilePage";


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
                                <RegisterUserPage />
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

                        <Route
                            path="profile"
                            element={
                                <AdminProfile />
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
                        element={<CoachLayout />}
                    >

                        <Route
                            index
                            element={<CoachDashboard />}
                        />

                        <Route
                            path="attendance"
                            element={<CoachAttendancePage />}
                        />

                        <Route
                            path="equipment"
                            element={<CoachEquipmentPage />}
                        />

                        <Route
                            path="profile"
                            element={<CoachProfilePage />}
                        />

                    </Route>

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
                        element={<MemberLayout />}
                    >

                        <Route
                            index
                            element={<MemberDashboard />}
                        />

                        <Route
                            path="attendance"
                            element={<MemberAttendancePage />}
                        />

                        <Route
                            path="plans"
                            element={<MembershipPlansPage />}
                        />

                        <Route
                            path="payments"
                            element={<MemberPaymentsPage />}
                        />

                        <Route
                            path="equipment"
                            element={<MemberEquipmentPage />}
                        />

                        <Route
                            path="profile"
                            element={<MemberProfilePage />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default AppRoutes;