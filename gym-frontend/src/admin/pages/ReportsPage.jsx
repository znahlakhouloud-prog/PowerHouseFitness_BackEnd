import {
    useEffect,
    useState
} from "react";

import {
    getAnalytics,
    getReportHistory,
    generateReport,
    deleteReport
} from "../services/reportService";

import KpiCard from "../components/KpiCard";
import AttendanceChart from "../components/AttendanceChart";
import NewMembersChart from "../components/NewMembersChart";
import IncomeChart from "../components/IncomeChart";
import ExpiredMembershipsChart from "../components/ExpiredMembershipsChart";
import PaymentTypeChart from "../components/PaymentTypeChart";

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
                    <p>Follow income, membership and attendance trends</p>
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

                <>

                    <div className="kpi-grid">

                        <KpiCard
                            title="Total Income"
                            value={`${Number(
                                analytics.income || 0
                            ).toLocaleString()} DA`}
                        />

                        <KpiCard
                            title="New Members"
                            value={analytics.newMembers || 0}
                        />

                        <KpiCard
                            title="Expired Memberships"
                            value={analytics.expiredMemberships || 0}
                        />

                        <KpiCard
                            title="Top Membership"
                            value={analytics.topMembership || "N/A"}
                        />

                        <KpiCard
                            title="Attendance"
                            value={analytics.attendance || 0}
                        />

                    </div>


                    <div className="charts-grid reports-charts-grid">

                        <div className="dashboard-card">

                            <div className="card-header">
                                <h2>Monthly Attendance</h2>
                            </div>

                            <AttendanceChart
                                data={analytics.monthlyAttendance || []}
                            />

                        </div>

                        <div className="dashboard-card">

                            <div className="card-header">
                                <h2>New Members</h2>
                            </div>

                            <NewMembersChart
                                data={analytics.monthlyNewMembers || []}
                            />

                        </div>

                        <div className="dashboard-card">

                            <div className="card-header">
                                <h2>Monthly Income</h2>
                            </div>

                            <IncomeChart
                                data={analytics.monthlyIncome || []}
                            />

                        </div>

                        <div className="dashboard-card">

                            <div className="card-header">
                                <h2>Expired Memberships</h2>
                            </div>

                            <ExpiredMembershipsChart
                                data={analytics.monthlyExpiredMemberships || []}
                            />

                        </div>

                        <div className="dashboard-card">

                            <div className="card-header">
                                <h2>Revenue by Payment Type</h2>
                            </div>

                            <PaymentTypeChart
                                data={analytics.monthlyPaymentsByType || []}
                            />

                        </div>

                    </div>

                </>

            )}


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
