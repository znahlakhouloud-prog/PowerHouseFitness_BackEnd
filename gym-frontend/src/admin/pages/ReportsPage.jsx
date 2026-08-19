import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { Wallet, UserPlus, UserX, Trophy, CalendarCheck } from "lucide-react";

import {
    getAnalytics,
    getReportHistory,
    generateReport,
    deleteReport
} from "../services/reportService";

import KpiCard from "../components/KpiCard";

import "../style/adminDashboard.css";
import "../style/reportsPage.css";

function ReportsPage() {

    const [analytics, setAnalytics] = useState(null);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [generating, setGenerating] = useState(false);
    const [actionError, setActionError] = useState("");


    const loadAll = async () => {

        try {

            setError("");

            const [analyticsData, historyData] = await Promise.all([
                getAnalytics(),
                getReportHistory()
            ]);

            setAnalytics(analyticsData);
            setHistory(historyData);

        } catch (err) {

            console.error("LOAD REPORTS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load reports"
            );

        }

    };

    useEffect(() => {

        const initialLoad = async () => {

            await loadAll();

            setLoading(false);

        };

        initialLoad();

    }, []);


    const handleGenerate = async () => {

        setGenerating(true);
        setActionError("");

        try {

            await generateReport();

            await loadAll();

        } catch (err) {

            console.error("GENERATE REPORT ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to generate report"
            );

        } finally {

            setGenerating(false);

        }

    };


    const handleDelete = async (report) => {

        const confirmed = window.confirm(
            `Delete the report from ` +
            `${new Date(report.created_at).toLocaleDateString()}? ` +
            `This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {

            await deleteReport(report.id);

            await loadAll();

        } catch (err) {

            console.error("DELETE REPORT ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to delete report"
            );

        }

    };


    if (loading) {

        return (
            <div className="admin-dashboard-loading">
                Loading reports...
            </div>
        );

    }

    if (error) {

        return (
            <div className="admin-dashboard-error">
                {error}
            </div>
        );

    }


    return (

        <div className="admin-dashboard reports-page">

            <div className="dashboard-header">

                <div>
                    <h1>Reports &amp; Analytics</h1>
                    <p>Save point-in-time snapshots of the gym's numbers</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating ? "Generating..." : "Generate Report"}
                </button>

            </div>


            {actionError && (
                <div className="dashboard-error">{actionError}</div>
            )}


            {analytics && (

                <div className="kpi-grid">

                    <KpiCard
                        title="Total Income"
                        value={`${Number(
                            analytics.income || 0
                        ).toLocaleString()} DA`}
                        icon={<Wallet size={18} />}
                    />

                    <KpiCard
                        title="New Members Today"
                        value={analytics.newMembers || 0}
                        icon={<UserPlus size={18} />}
                    />

                    <KpiCard
                        title="Expired Memberships"
                        value={analytics.expiredMemberships || 0}
                        icon={<UserX size={18} />}
                    />

                    <KpiCard
                        title="Top Membership"
                        value={analytics.topMembership || "N/A"}
                        icon={<Trophy size={18} />}
                    />

                    <KpiCard
                        title="Attendance This Month"
                        value={analytics.attendance || 0}
                        icon={<CalendarCheck size={18} />}
                    />

                </div>

            )}

            <p className="reports-dashboard-hint">
                Looking for charts and trends? The full breakdown now lives
                on the <Link to="/admin">Dashboard</Link>.
            </p>


            <div className="dashboard-card report-history-card">

                <div className="card-header">
                    <h2>Report History</h2>
                    <p>Snapshots saved with "Generate Report"</p>
                </div>

                {history.length === 0 ? (

                    <div className="reports-empty">
                        No saved reports yet.
                    </div>

                ) : (

                    <div className="reports-table-card">

                        <table className="reports-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Income</th>
                                    <th>New Members</th>
                                    <th>Expired</th>
                                    <th>Top Membership</th>
                                    <th>Attendance</th>
                                    <th></th>
                                </tr>

                            </thead>

                            <tbody>

                                {history.map((r) => (

                                    <tr key={r.id}>

                                        <td>
                                            {r.created_at
                                                ? new Date(
                                                    r.created_at
                                                ).toLocaleDateString()
                                                : "—"
                                            }
                                        </td>

                                        <td>
                                            {Number(r.income).toLocaleString()} DA
                                        </td>

                                        <td>{r.nbr_new_member}</td>

                                        <td>{r.nbr_expired_membership}</td>

                                        <td>{r.top_membership || "N/A"}</td>

                                        <td>{r.nbr_attendance}</td>

                                        <td>

                                            <button
                                                className="btn-link btn-danger"
                                                onClick={() =>
                                                    handleDelete(r)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default ReportsPage;
