import {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Wallet,
    UserPlus,
    UserX,
    Trophy,
    CalendarCheck,
    Users,
    CalendarClock,
    Clock,
    Wrench
} from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getAnalytics } from "../services/reportService";

import KpiCard from "../components/KpiCard";
import PeriodSelector from "../components/PeriodSelector";
import AttendanceChart from "../components/AttendanceChart";
import NewMembersChart from "../components/NewMembersChart";
import IncomeChart from "../components/IncomeChart";
import ExpiredMembershipsChart from "../components/ExpiredMembershipsChart";
import PaymentTypeChart from "../components/PaymentTypeChart";
import MembershipStatusChart from "../components/MembershipStatusChart";

import "../style/adminDashboard.css";


function AdminDashboard() {

    const { token, user } = useContext(AuthContext);

    const [report, setReport] = useState(null);

    const [period, setPeriod] = useState("year");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const analyticsData = await getAnalytics(period);

            setReport(analyticsData);

        } catch (err) {

            console.error("LOAD DASHBOARD ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (!token) {
            return;
        }

        loadDashboard();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, period]);


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

                <p>{error}</p>

                <button
                    className="dashboard-action-button"
                    onClick={loadDashboard}
                >
                    Try Again
                </button>

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
                        Welcome back, {user?.user_name || "Admin"}
                    </p>

                </div>

                <PeriodSelector
                    value={period}
                    onChange={setPeriod}
                />

            </div>


            {/* KPI CARDS */}

            <div className="kpi-grid">

                <KpiCard
                    title="Total Income"
                    value={`${Number(report.income || 0).toLocaleString()} DA`}
                    icon={<Wallet size={18} />}
                />

                <KpiCard
                    title="Active Members"
                    value={report.activeMembers || 0}
                    icon={<Users size={18} />}
                />

                <KpiCard
                    title="Expired Memberships"
                    value={report.expiredMemberships || 0}
                    icon={<UserX size={18} />}
                />

                <KpiCard
                    title="New Members Today"
                    value={report.newMembers || 0}
                    icon={<UserPlus size={18} />}
                />

                <KpiCard
                    title="Attendance Today"
                    value={report.attendanceToday || 0}
                    icon={<CalendarClock size={18} />}
                />

                <KpiCard
                    title="Attendance This Month"
                    value={report.attendance || 0}
                    icon={<CalendarCheck size={18} />}
                />

                <KpiCard
                    title="Pending Payments"
                    value={report.pendingPayments || 0}
                    icon={<Clock size={18} />}
                />

                <KpiCard
                    title="Equipment Issues"
                    value={report.equipmentIssues || 0}
                    icon={<Wrench size={18} />}
                />

                <KpiCard
                    title="Top Membership"
                    value={report.topMembership || "N/A"}
                    icon={<Trophy size={18} />}
                />

            </div>


            {/* CHARTS */}

            <div className="charts-grid">

                <IncomeChart data={report.incomeTrend} />

                <AttendanceChart data={report.attendanceTrend} />

                <NewMembersChart data={report.newMembersTrend} />

                <ExpiredMembershipsChart data={report.expiredMembershipsTrend} />

                <PaymentTypeChart data={report.paymentsByTypeTrend} />

                <MembershipStatusChart data={report.membershipStatus} />

            </div>

        </div>

    );
}

export default AdminDashboard;
