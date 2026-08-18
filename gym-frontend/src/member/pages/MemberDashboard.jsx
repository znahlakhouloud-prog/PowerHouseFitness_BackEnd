import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    CalendarCheck,
    BadgeDollarSign,
    CreditCard,
    Wrench
} from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getMyMembership } from "../services/membershipService";
import { getMyAttendance } from "../services/attendanceService";
import { getMyPayments } from "../services/paymentService";

import MembershipCard from "../components/MembershipCard";
import KpiCard from "../../admin/components/KpiCard";

import "../style/member.css";

const isSameMonth = (date, ref) =>
    date.getFullYear() === ref.getFullYear() &&
    date.getMonth() === ref.getMonth();

function MemberDashboard() {

    const { user } = useContext(AuthContext);

    const [membership, setMembership] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                let activeMembership = null;

                try {

                    const result = await getMyMembership(user.id);
                    activeMembership = result.membership;

                } catch {

                    // No active membership - not an error, just an
                    // empty state for the membership card.

                }

                setMembership(activeMembership);

                const attendanceData = await getMyAttendance(user.id);
                setAttendance(attendanceData);

                if (activeMembership) {

                    const paymentsData = await getMyPayments(
                        activeMembership.id
                    );
                    setPayments(paymentsData);

                }

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

        loadDashboard();

    }, [user.id]);


    if (loading) {

        return (
            <div className="member-loading">
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

    const thisMonthVisits = attendance.filter((a) =>
        isSameMonth(new Date(a.attendance_date), now)
    ).length;

    const lastVisit = attendance[0]?.check_in
        ? new Date(attendance[0].check_in).toLocaleDateString()
        : "—";

    const approvedPayments = payments.filter(
        (p) => p.status === "approved"
    );

    const totalPaid = approvedPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
    );

    const remaining = membership
        ? Math.max(Number(membership.price) - totalPaid, 0)
        : 0;

    const lastPayment = payments[payments.length - 1];


    return (

        <div className="member-dashboard">

            <div className="page-header">

                <div>
                    <h1>Welcome back, {user?.user_name}</h1>
                    <p>Here's what's happening with your membership</p>
                </div>

            </div>


            <div className="member-kpi-grid">

                <KpiCard
                    title="This Month's Visits"
                    value={thisMonthVisits}
                    icon={<CalendarCheck size={18} />}
                    description={`${attendance.length} total visits`}
                />

                <KpiCard
                    title="Last Visit"
                    value={lastVisit}
                    icon={<CalendarCheck size={18} />}
                />

                <KpiCard
                    title="Total Paid"
                    value={`${totalPaid.toLocaleString()} DA`}
                    icon={<CreditCard size={18} />}
                    description={
                        membership
                            ? `${remaining.toLocaleString()} DA remaining`
                            : "No active membership"
                    }
                />

                <KpiCard
                    title="Last Payment"
                    value={
                        lastPayment
                            ? `${Number(lastPayment.amount).toLocaleString()} DA`
                            : "—"
                    }
                    icon={<BadgeDollarSign size={18} />}
                    description={
                        lastPayment
                            ? lastPayment.status
                            : undefined
                    }
                />

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>My Membership</h2>
                </div>

                {membership ? (
                    <MembershipCard membership={membership} />
                ) : (
                    <div className="member-empty">
                        You don't have an active membership yet.{" "}
                        <Link to="/member/plans">
                            Choose a plan
                        </Link>
                    </div>
                )}

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions-grid">

                    <Link to="/member/attendance" className="quick-action-card">
                        <div className="quick-action-icon">
                            <CalendarCheck size={20} />
                        </div>
                        <strong>My Attendance</strong>
                        <span>View your check-in history</span>
                    </Link>

                    <Link to="/member/plans" className="quick-action-card">
                        <div className="quick-action-icon">
                            <BadgeDollarSign size={20} />
                        </div>
                        <strong>Membership Plans</strong>
                        <span>Browse or choose a plan</span>
                    </Link>

                    <Link to="/member/payments" className="quick-action-card">
                        <div className="quick-action-icon">
                            <CreditCard size={20} />
                        </div>
                        <strong>Payments</strong>
                        <span>View history or pay now</span>
                    </Link>

                    <Link to="/member/equipment" className="quick-action-card">
                        <div className="quick-action-icon">
                            <Wrench size={20} />
                        </div>
                        <strong>Equipment</strong>
                        <span>Report broken equipment</span>
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default MemberDashboard;
