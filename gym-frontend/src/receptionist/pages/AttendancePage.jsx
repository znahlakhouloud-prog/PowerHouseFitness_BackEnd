import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { getAttendances } from "../services/attendanceService";

import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

import "../style/receptionist.css";

const PAGE_SIZE = 15;

function AttendancePage() {

    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);


    useEffect(() => {

        const loadAttendance = async () => {

            try {

                const data = await getAttendances();

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

    }, []);


    const filteredAttendance = attendance.filter((a) => {

        const term = search.trim().toLowerCase();

        return (
            !term ||
            a.user_name.toLowerCase().includes(term)
        );

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


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading attendance...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="attendance-page">

            <div className="page-header">

                <div>
                    <h1>Attendance</h1>
                    <p>Follow member check-ins</p>
                </div>

            </div>


            <div className="members-toolbar">

                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by member name..."
                />

            </div>


            {pageAttendance.length === 0 ? (

                <div className="receptionist-empty">
                    No attendance records found.
                </div>

            ) : (

                <div className="receptionist-table-card">

                    <table className="receptionist-table">

                        <thead>

                            <tr>
                                <th>Member</th>
                                <th>Date</th>
                                <th>Check-in Time</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {pageAttendance.map((a) => (

                                <tr key={a.id}>

                                    <td>{a.user_name}</td>

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

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                navigate(
                                                    `/receptionist/members/${a.id_user}`
                                                )
                                            }
                                        >
                                            View Member
                                        </button>

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
