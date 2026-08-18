import { useContext, useEffect, useState } from "react";

import { CalendarCheck, CalendarDays, CalendarRange, History } from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getMyAttendance } from "../services/attendanceService";

import KpiCard from "../../admin/components/KpiCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

import "../style/member.css";

const PAGE_SIZE = 10;

const startOfWeek = (ref) => {

    const day = ref.getDay();
    const diff = (day === 0 ? 6 : day - 1);

    const start = new Date(ref);
    start.setDate(ref.getDate() - diff);
    start.setHours(0, 0, 0, 0);

    return start;

};

function AttendancePage() {

    const { user } = useContext(AuthContext);

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);


    useEffect(() => {

        const loadAttendance = async () => {

            try {

                const data = await getMyAttendance(user.id);
                setAttendance(data);

            } catch (err) {

                console.error("LOAD ATTENDANCE ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load attendance"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAttendance();

    }, [user.id]);


    if (loading) {

        return (
            <div className="member-loading">
                Loading attendance...
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

    const thisMonthCount = attendance.filter((a) => {
        const d = new Date(a.attendance_date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

    const thisWeekCount = attendance.filter((a) =>
        new Date(a.attendance_date) >= weekStart
    ).length;

    const lastVisit = attendance[0]?.attendance_date
        ? new Date(attendance[0].attendance_date).toLocaleDateString()
        : "—";

    const filteredAttendance = attendance.filter((a) => {

        const term = search.trim();

        if (!term) {
            return true;
        }

        const dateStr = a.attendance_date
            ? new Date(a.attendance_date).toLocaleDateString()
            : "";

        return dateStr.includes(term);

    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAttendance.length / PAGE_SIZE)
    );

    const pageAttendance = filteredAttendance.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleSearchChange = (value) => {

        setSearch(value);
        setPage(1);

    };


    return (

        <div className="attendance-page">

            <div className="page-header">

                <div>
                    <h1>My Attendance</h1>
                    <p>Your gym check-in history</p>
                </div>

            </div>


            <div className="summary-grid">

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
                    title="Last Visit"
                    value={lastVisit}
                    icon={<CalendarCheck size={18} />}
                />

            </div>


            <div className="members-toolbar">

                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by date (e.g. 8/18/2026)..."
                />

            </div>


            {pageAttendance.length === 0 ? (

                <div className="member-empty">
                    No attendance records found.
                </div>

            ) : (

                <div className="member-table-card">

                    <table className="member-table">

                        <thead>

                            <tr>
                                <th>Date</th>
                                <th>Check-in Time</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {pageAttendance.map((a) => (

                                <tr key={a.id}>

                                    <td>
                                        {a.attendance_date
                                            ? new Date(
                                                a.attendance_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        {a.check_in
                                            ? new Date(
                                                a.check_in
                                            ).toLocaleTimeString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        <span className="status-badge status-active">
                                            Present
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>

    );
}

export default AttendancePage;
