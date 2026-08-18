import {
    useContext,
    useEffect,
    useState
} from "react";

import { AuthContext } from "../../auth/context/authContext";

import { getAnalytics } from "../services/reportService";

import KPIcard from "../components/KpiCard";
import AttendanceChart from "../components/AttendanceChart";
import NewMembersChart from "../components/NewMembersChart";
import IncomeChart from "../components/IncomeChart";
import ExpiredMembershipsChart from "../components/ExpiredMembershipsChart";
import PaymentTypeChart from "../components/PaymentTypeChart";

import "../style/adminDashboard.css";


function AdminDashboard() {

    const { token } = useContext(AuthContext);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        if (!token) {
            return;
        }

        let cancelled = false;

        const loadReports = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getAnalytics(token);

                if (!cancelled) {
                    setReport(data);
                }

            } catch (error) {

                console.error(
                    "LOAD REPORT ERROR:",
                    error
                );

                if (!cancelled) {

                    setError(
                        error.response?.data?.message ||
                        "Failed to load dashboard data"
                    );

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        loadReports();

        return () => {
            cancelled = true;
        };

    }, [token]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="admin-dashboard-loading">
                Loading dashboard...
            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="admin-dashboard-error">
                {error}
            </div>
        );

    }


    // =========================
    // NO DATA
    // =========================

    if (!report) {

        return (
            <div className="admin-dashboard-empty">
                No dashboard data available.
            </div>
        );

    }


    // =========================
    // DASHBOARD
    // =========================

    return (

        <div className="admin-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back, Admin
                    </p>

                </div>

            </div>


            {/* KPI CARDS */}

            <div className="kpi-grid">

                <KPIcard
                    title="Total Income"
                    value={`${Number(
                        report.income || 0
                    ).toLocaleString()} DA`}
                />

                <KPIcard
                    title="New Members"
                    value={
                        report.newMembers || 0
                    }
                />

                <KPIcard
                    title="Expired Memberships"
                    value={
                        report.expiredMemberships || 0
                    }
                />

                <KPIcard
                    title="Top Membership"
                    value={
                        report.topMembership ||
                        "N/A"
                    }
                />

                <KPIcard
                    title="Attendance"
                    value={
                        report.attendance || 0
                    }
                />

            </div>


            {/* CHARTS */}

            <div className="charts-grid">

                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            Monthly Attendance
                        </h2>

                    </div>

                    <AttendanceChart
                        data={
                            report.monthlyAttendance ||
                            []
                        }
                    />

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            New Members
                        </h2>

                    </div>

                    <NewMembersChart
                        data={
                            report.monthlyNewMembers ||
                            []
                        }
                    />

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            Monthly Income
                        </h2>

                    </div>

                    <IncomeChart
                        data={
                            report.monthlyIncome ||
                            []
                        }
                    />

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            Expired Memberships
                        </h2>

                    </div>

                    <ExpiredMembershipsChart
                        data={
                            report.monthlyExpiredMemberships ||
                            []
                        }
                    />

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            Revenue by Payment Type
                        </h2>

                    </div>

                    <PaymentTypeChart
                        data={
                            report.monthlyPaymentsByType ||
                            []
                        }
                    />

                </div>

            </div>

        </div>

    );
}

export default AdminDashboard;