import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CreditCard, Wallet, Receipt, Clock } from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getMyMembership } from "../services/membershipService";
import { getMyPayments } from "../services/paymentService";

import KpiCard from "../../admin/components/KpiCard";
import PaymentModal from "../components/PaymentModal";

import "../style/member.css";

function PaymentsPage() {

    const { user } = useContext(AuthContext);

    const [membership, setMembership] = useState(null);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [modalOpen, setModalOpen] = useState(false);


    const loadPayments = async (membershipId) => {

        const data = await getMyPayments(membershipId);
        setPayments(data);

    };


    useEffect(() => {

        const load = async () => {

            try {

                let activeMembership = null;

                try {

                    const result = await getMyMembership(user.id);
                    activeMembership = result.membership;

                } catch {

                    // No active membership yet.

                }

                setMembership(activeMembership);

                if (activeMembership) {
                    await loadPayments(activeMembership.id);
                }

            } catch (err) {

                console.error("LOAD PAYMENTS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load payments"
                );

            } finally {

                setLoading(false);

            }

        };

        load();

    }, [user.id]);


    const handlePaymentSuccess = async (method) => {

        setModalOpen(false);

        setSuccessMessage(
            method === "card"
                ? "Payment approved."
                : "Bank transfer submitted - it will show as pending until reviewed."
        );

        if (membership) {
            await loadPayments(membership.id);
        }

    };


    if (loading) {

        return (
            <div className="member-loading">
                Loading payments...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }

    if (!membership) {

        return (

            <div className="payments-page">

                <div className="page-header">
                    <div>
                        <h1>Payments</h1>
                        <p>Your payment history and balance</p>
                    </div>
                </div>

                <div className="member-empty">
                    You don't have an active membership yet.{" "}
                    <Link to="/member/plans">Choose a plan</Link>{" "}
                    to get started.
                </div>

            </div>

        );

    }

    const approvedTotal = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const remaining = Math.max(
        Number(membership.price) - approvedTotal,
        0
    );

    const pendingCount = payments.filter(
        (p) => p.status === "pending"
    ).length;

    const lastPayment = payments[payments.length - 1];


    return (

        <div className="payments-page">

            <div className="page-header">

                <div>
                    <h1>Payments</h1>
                    <p>Your payment history and balance</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={() => setModalOpen(true)}
                    disabled={remaining <= 0}
                >
                    Make a Payment
                </button>

            </div>

            {successMessage && (
                <div className="dashboard-success">{successMessage}</div>
            )}

            <div className="summary-grid">

                <KpiCard
                    title="Total Paid"
                    value={`${approvedTotal.toLocaleString()} DA`}
                    icon={<Wallet size={18} />}
                />

                <KpiCard
                    title="Remaining Balance"
                    value={`${remaining.toLocaleString()} DA`}
                    icon={<CreditCard size={18} />}
                    description={
                        remaining <= 0 ? "Fully paid" : undefined
                    }
                />

                <KpiCard
                    title="Last Payment"
                    value={
                        lastPayment
                            ? `${Number(lastPayment.amount).toLocaleString()} DA`
                            : "—"
                    }
                    icon={<Receipt size={18} />}
                />

                <KpiCard
                    title="Pending Transfers"
                    value={pendingCount}
                    icon={<Clock size={18} />}
                />

            </div>

            {payments.length === 0 ? (

                <div className="member-empty">
                    No payments yet.
                </div>

            ) : (

                <div className="member-table-card">

                    <table className="member-table">

                        <thead>

                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Remaining After</th>
                            </tr>

                        </thead>

                        <tbody>

                            {[...payments].reverse().map((p) => (

                                <tr key={p.id}>

                                    <td>
                                        {p.p_date
                                            ? new Date(p.p_date).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        {Number(p.amount).toLocaleString()} DA
                                    </td>

                                    <td style={{ textTransform: "capitalize" }}>
                                        {p.type}
                                    </td>

                                    <td>
                                        <span className={`status-badge status-${p.status}`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    <td>
                                        {Number(p.rest).toLocaleString()} DA
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {modalOpen && (

                <PaymentModal
                    membershipId={membership.id}
                    remaining={remaining}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                />

            )}

        </div>

    );
}

export default PaymentsPage;
