import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CreditCard, Wallet, Receipt, AlertTriangle, Printer } from "lucide-react";

import { AuthContext } from "../../auth/context/authContext";

import { getMyMembership, getMyBalance } from "../services/membershipService";
import { getMyPayments } from "../services/paymentService";

import KpiCard from "../../admin/components/KpiCard";
import PaymentModal from "../components/PaymentModal";
import InvoiceModal from "../../shared/components/InvoiceModal";

import "../style/member.css";

const formatDA = (value) =>
    `${Number(value).toLocaleString()} DA`;

function PaymentsPage() {

    const { user } = useContext(AuthContext);

    const [membership, setMembership] = useState(null);
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [invoicePaymentId, setInvoicePaymentId] = useState(null);


    const loadPayments = async (membershipId) => {

        const data = await getMyPayments(membershipId);
        setPayments(data);

    };

    const loadBalance = async () => {

        const data = await getMyBalance(user.id);
        setBalance(data);

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

                await loadBalance();

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


    const handlePaymentSuccess = async () => {

        setModalOpen(false);

        setSuccessMessage("Payment recorded successfully.");

        if (membership) {
            await loadPayments(membership.id);
        }

        await loadBalance();

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

    const previousUnpaidBalance = balance?.previousUnpaidBalance || 0;

    if (!membership) {

        return (

            <div className="payments-page">

                <div className="page-header">
                    <div>
                        <h1>Payments</h1>
                        <p>Your payment history and balance</p>
                    </div>
                </div>

                {previousUnpaidBalance > 0 && (

                    <div className="dashboard-error">
                        <AlertTriangle size={16} />
                        {" "}You have an unpaid balance of{" "}
                        {formatDA(previousUnpaidBalance)} from a previous
                        membership. Please settle it with the front desk
                        before starting your next season.
                    </div>

                )}

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
                    value={formatDA(approvedTotal)}
                    icon={<Wallet size={18} />}
                />

                <KpiCard
                    title="Remaining Balance"
                    value={formatDA(remaining)}
                    icon={<CreditCard size={18} />}
                    description={
                        remaining <= 0 ? "Fully paid" : undefined
                    }
                />

                <KpiCard
                    title="Last Payment"
                    value={
                        lastPayment
                            ? formatDA(lastPayment.amount)
                            : "—"
                    }
                    icon={<Receipt size={18} />}
                />

                <KpiCard
                    title="Previous Unpaid Balance"
                    value={formatDA(previousUnpaidBalance)}
                    icon={<AlertTriangle size={18} />}
                    description={
                        previousUnpaidBalance > 0
                            ? "From a past membership"
                            : "No outstanding balance"
                    }
                />

            </div>

            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Payment Status</h2>
                </div>

                <div className="payment-status-row">
                    <span>Current Membership</span>
                    <strong className="payment-status-state">
                        {membership.state}
                    </strong>
                </div>

                <div className="register-payment-summary">

                    <div>
                        <span>Total</span>
                        <strong>{formatDA(membership.price)}</strong>
                    </div>

                    <div>
                        <span>Paid</span>
                        <strong>{formatDA(approvedTotal)}</strong>
                    </div>

                    <div className="register-payment-summary-remaining">
                        <span>Remaining</span>
                        <strong>{formatDA(remaining)}</strong>
                    </div>

                </div>

                <div className="payment-status-balance">

                    <span className="payment-status-balance-label">
                        Previous Unpaid Balance
                    </span>

                    {previousUnpaidBalance > 0 ? (

                        <p className="dashboard-error">
                            {formatDA(previousUnpaidBalance)} still owed from
                            {" "}{balance.previousBreakdown.length === 1
                                ? "a previous membership"
                                : `${balance.previousBreakdown.length} previous memberships`
                            }.
                        </p>

                    ) : (

                        <p className="dashboard-success">
                            No outstanding balance
                        </p>

                    )}

                </div>

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
                                <th></th>
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
                                        {formatDA(p.amount)}
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
                                        {formatDA(p.rest)}
                                    </td>

                                    <td>
                                        {p.status === "approved" && (

                                            <button
                                                type="button"
                                                className="btn-link"
                                                onClick={() =>
                                                    setInvoicePaymentId(p.id)
                                                }
                                            >
                                                <Printer size={14} />
                                                Invoice
                                            </button>

                                        )}
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

            {invoicePaymentId && (

                <InvoiceModal
                    paymentId={invoicePaymentId}
                    onClose={() => setInvoicePaymentId(null)}
                />

            )}

        </div>

    );
}

export default PaymentsPage;
