import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { getMemberById } from "../services/memberService";
import { getMemberships } from "../services/membershipService";
import { getPaymentsByMembership } from "../services/paymentService";
import { getAttendances } from "../services/attendanceService";

import MembershipCard from "../components/MembershipCard";
import MemberStatusBadge from "../components/MemberStatusBadge";

import {
    getCurrentMembership,
    getMembershipStatus
} from "../utils/membershipStatus";

import { calculateAge, formatDateOnly } from "../../shared/utils/dateUtils";

import "../style/receptionist.css";
import "../style/memberDetails.css";

function MemberDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [member, setMember] = useState(null);
    const [history, setHistory] = useState([]);
    const [payments, setPayments] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadDetails = async () => {

            try {

                setLoading(true);
                setError("");

                const [memberData, allMemberships, allAttendance] =
                    await Promise.all([
                        getMemberById(id),
                        getMemberships(),
                        getAttendances()
                    ]);

                setMember(memberData);

                const ownAttendance = allAttendance
                    .filter((a) => a.id_user === Number(id))
                    .sort(
                        (a, b) =>
                            new Date(b.check_in) -
                            new Date(a.check_in)
                    );

                setAttendance(ownAttendance);

                const ownMemberships = allMemberships
                    .filter((m) => m.id_user === Number(id))
                    .sort(
                        (a, b) =>
                            new Date(b.start_date) -
                            new Date(a.start_date)
                    );

                setHistory(ownMemberships);

                const current = getCurrentMembership(
                    Number(id),
                    allMemberships
                );

                if (current) {

                    const paymentData =
                        await getPaymentsByMembership(current.id);

                    setPayments(paymentData);

                }

            } catch (err) {

                console.error("LOAD MEMBER DETAILS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load member details"
                );

            } finally {

                setLoading(false);

            }

        };

        loadDetails();

    }, [id]);


    useEffect(() => {

        if (!loading && window.location.hash === "#membership") {

            document
                .getElementById("membership-section")
                ?.scrollIntoView({ behavior: "smooth" });

        }

    }, [loading]);


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading member details...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }

    if (!member) {

        return (
            <div className="receptionist-empty">
                Member not found.
            </div>
        );

    }

    const currentMembership = history.find(
        (m) => m.state === "active"
    ) || history[0] || null;


    return (

        <div className="member-details-page">

            <div className="page-header">

                <div>

                    <button
                        className="btn-link back-link"
                        onClick={() =>
                            navigate("/receptionist/members")
                        }
                    >
                        ← Back to Members
                    </button>

                    <h1>{member.user_name}</h1>
                    <p>{member.email}</p>

                </div>

            </div>


            <div className="dashboard-card member-info-card">

                <div className="card-header">
                    <h2>Personal Information</h2>
                </div>

                <div className="member-info-grid">

                    <div className="member-info-item">
                        <span>Full Name</span>
                        <strong>{member.user_name}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Birth Date</span>
                        <strong>{formatDateOnly(member.birth_date)}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Age</span>
                        <strong>{calculateAge(member.birth_date)}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Email</span>
                        <strong>{member.email}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Role</span>
                        <strong>{member.role}</strong>
                    </div>

                </div>

            </div>


            <div
                id="membership-section"
                className="dashboard-card"
            >

                <div className="card-header">
                    <h2>Current Membership</h2>
                </div>

                {currentMembership ? (

                    <MembershipCard membership={currentMembership} />

                ) : (

                    <div className="receptionist-empty">
                        This member has no membership yet.
                    </div>

                )}

            </div>


            {currentMembership && (

                <div className="dashboard-card">

                    <div className="card-header">
                        <h2>Payment Status</h2>
                    </div>

                    {payments.length === 0 ? (

                        <div className="receptionist-empty">
                            No payments recorded for this membership.
                        </div>

                    ) : (

                        <div className="receptionist-table-card">

                            <table className="receptionist-table">

                                <thead>

                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Rest</th>
                                        <th>Type</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {payments.map((p) => (

                                        <tr key={p.id}>

                                            <td>
                                                {p.p_date
                                                    ? new Date(
                                                        p.p_date
                                                    ).toLocaleDateString()
                                                    : "—"
                                                }
                                            </td>

                                            <td>
                                                {Number(
                                                    p.amount
                                                ).toLocaleString()} DA
                                            </td>

                                            <td>
                                                {Number(p.rest) <= 0
                                                    ? "Paid"
                                                    : `${Number(
                                                        p.rest
                                                    ).toLocaleString()} DA due`
                                                }
                                            </td>

                                            <td>{p.type}</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Membership History</h2>
                </div>

                {history.length === 0 ? (

                    <div className="receptionist-empty">
                        No membership history.
                    </div>

                ) : (

                    <div className="receptionist-table-card">

                        <table className="receptionist-table">

                            <thead>

                                <tr>
                                    <th>Plan</th>
                                    <th>Type</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {history.map((m) => (

                                    <tr key={m.id}>

                                        <td>{m.name}</td>

                                        <td>{m.type}</td>

                                        <td>
                                            {m.start_date
                                                ? new Date(
                                                    m.start_date
                                                ).toLocaleDateString()
                                                : "—"
                                            }
                                        </td>

                                        <td>
                                            {m.end_date
                                                ? new Date(
                                                    m.end_date
                                                ).toLocaleDateString()
                                                : "—"
                                            }
                                        </td>

                                        <td>
                                            <MemberStatusBadge
                                                status={getMembershipStatus(m)}
                                            />
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Attendance History</h2>
                    <p>{attendance.length} check-in{attendance.length === 1 ? "" : "s"} recorded</p>
                </div>

                {attendance.length === 0 ? (

                    <div className="receptionist-empty">
                        No check-ins recorded yet.
                    </div>

                ) : (

                    <div className="receptionist-table-card">

                        <table className="receptionist-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Check-in Time</th>
                                </tr>

                            </thead>

                            <tbody>

                                {attendance.map((a) => (

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

export default MemberDetailsPage;
