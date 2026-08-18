import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    CalendarCheck,
    CalendarDays,
    CalendarRange,
    History,
    Wrench,
    User
} from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getMyAttendance } from "../services/attendanceService";
import {
    getMyEquipmentReports,
    reportEquipment
} from "../../shared/services/equipmentService";

import KpiCard from "../../admin/components/KpiCard";
import QuickActionCard from "../components/QuickActionCard";
import EquipmentReportTable from "../../shared/components/equipment/EquipmentReportTable";
import EquipmentReportModal from "../../shared/components/equipment/EquipmentReportModal";

import "../style/coach.css";

const RECENT_REPORTS_LIMIT = 3;

const isSameMonth = (date, ref) =>
    date.getFullYear() === ref.getFullYear() &&
    date.getMonth() === ref.getMonth();

const startOfWeek = (ref) => {

    const day = ref.getDay();
    const diff = (day === 0 ? 6 : day - 1);

    const start = new Date(ref);
    start.setDate(ref.getDate() - diff);
    start.setHours(0, 0, 0, 0);

    return start;

};

function CoachDashboard() {

    const { user } = useContext(AuthContext);

    const [attendance, setAttendance] = useState([]);
    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);


    const loadReports = async () => {

        const data = await getMyEquipmentReports();
        setReports(data);

    };


    useEffect(() => {

        const load = async () => {

            try {

                const [attendanceData, reportsData] = await Promise.all([
                    getMyAttendance(user.id),
                    getMyEquipmentReports()
                ]);

                setAttendance(attendanceData);
                setReports(reportsData);

            } catch (err) {

                console.error("LOAD DASHBOARD ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        load();

    }, [user.id]);


    const handleReportSave = async (data) => {

        await reportEquipment(data);

        setModalOpen(false);

        await loadReports();

    };


    if (loading) {

        return (
            <div className="coach-loading">
                Loading dashboard...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    const now = new Date();
    const weekStart = startOfWeek(now);

    const thisMonthCount = attendance.filter((a) =>
        isSameMonth(new Date(a.attendance_date), now)
    ).length;

    const thisWeekCount = attendance.filter((a) =>
        new Date(a.attendance_date) >= weekStart
    ).length;

    const lastCheckIn = attendance[0]?.check_in
        ? new Date(attendance[0].check_in).toLocaleString()
        : "—";

    const recentReports = reports.slice(0, RECENT_REPORTS_LIMIT);


    return (

        <div className="coach-dashboard">

            <div className="page-header">

                <div>
                    <h1>Welcome back, {user?.user_name}</h1>
                    <p>Here's your activity at a glance</p>
                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>My Attendance</h2>
                </div>

                <div className="coach-kpi-grid">

                    <KpiCard
                        title="Total Visits"
                        value={attendance.length}
                        icon={<History size={18} />}
                    />

                    <KpiCard
                        title="This Month"
                        value={thisMonthCount}
                        icon={<CalendarDays size={18} />}
                    />

                    <KpiCard
                        title="This Week"
                        value={thisWeekCount}
                        icon={<CalendarRange size={18} />}
                    />

                    <KpiCard
                        title="Last Check-in"
                        value={lastCheckIn}
                        icon={<CalendarCheck size={18} />}
                    />

                </div>

                <Link to="/coach/attendance" className="btn-secondary">
                    View My Attendance
                </Link>

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Equipment</h2>
                    <p>Report a broken equipment or check existing reports.</p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>

                    <Link to="/coach/equipment" className="btn-secondary">
                        View Equipment
                    </Link>

                    <button
                        className="btn-primary"
                        onClick={() => setModalOpen(true)}
                    >
                        Report Problem
                    </button>

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Recent Equipment Reports</h2>
                </div>

                <EquipmentReportTable
                    reports={recentReports}
                    emptyMessage="You haven't reported any equipment issues."
                />

                {reports.length > 0 && (

                    <Link
                        to="/coach/equipment"
                        className="btn-link"
                        style={{ display: "inline-block", marginTop: 14 }}
                    >
                        View All Reports
                    </Link>

                )}

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions-grid">

                    <QuickActionCard
                        to="/coach/attendance"
                        icon={<CalendarCheck size={20} />}
                        title="View Attendance"
                        description="See your check-in history"
                    />

                    <QuickActionCard
                        to="/coach/equipment"
                        icon={<Wrench size={20} />}
                        title="View Equipment"
                        description="Browse gym equipment"
                    />

                    <QuickActionCard
                        to="/coach/equipment"
                        icon={<Wrench size={20} />}
                        title="Report Broken Equipment"
                        description="Flag an equipment issue"
                    />

                    <QuickActionCard
                        to="/coach/profile"
                        icon={<User size={20} />}
                        title="My Profile"
                        description="View or edit your info"
                    />

                </div>

            </div>


            {modalOpen && (

                <EquipmentReportModal
                    onClose={() => setModalOpen(false)}
                    onSave={handleReportSave}
                />

            )}

        </div>

    );
}

export default CoachDashboard;
