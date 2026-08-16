import {
    useEffect,
    useState
} from "react";

import {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
} from "../services/paymentService";

import { getMemberships } from "../services/membershipService";
import { getUsers } from "../services/userService";

import PaymentModal from "../components/PaymentModal";

import "../style/paymentsPage.css";

const TYPE_TABS = [
    { label: "All", value: "all" },
    { label: "Cash", value: "cash" },
    { label: "Card", value: "card" },
    { label: "Transfer", value: "transfer" }
];

function PaymentsPage() {

    const [payments, setPayments] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const [modalMode, setModalMode] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);

    const [actionError, setActionError] = useState("");


    useEffect(() => {

        const loadAll = async () => {

            try {

                const [
                    paymentsData,
                    membershipsData,
                    usersData
                ] = await Promise.all([
                    getPayments(),
                    getMemberships(),
                    getUsers()
                ]);

                setPayments(paymentsData);
                setMemberships(membershipsData);
                setUsers(usersData);

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

        loadAll();

    }, []);


    const refreshPayments = async () => {

        try {

            const data = await getPayments();

            setPayments(data);

        } catch (err) {

            console.error("REFRESH PAYMENTS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load payments"
            );

        }

    };


    const filteredPayments = payments.filter((p) => {

        const matchesTab =
            activeTab === "all" || p.type === activeTab;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term ||
            p.user_name?.toLowerCase().includes(term) ||
            p.membership_name?.toLowerCase().includes(term);

        return matchesTab && matchesSearch;

    });


    const handleAdd = () => {

        setEditingPayment(null);
        setModalMode("add");

    };

    const handleEdit = (payment) => {

        setEditingPayment(payment);
        setModalMode("edit");

    };

    const closeModal = () => {

        setModalMode(null);
        setEditingPayment(null);

    };

    const handleSave = async (id, formData) => {

        if (modalMode === "add") {

            await createPayment(formData);

        } else {

            await updatePayment(id, formData);

        }

        closeModal();

        await refreshPayments();

    };


    const handleDelete = async (payment) => {

        const confirmed = window.confirm(
            `Delete this payment of ${payment.amount} from ` +
            `${payment.user_name}? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {

            await deletePayment(payment.id);

            await refreshPayments();

        } catch (err) {

            console.error("DELETE PAYMENT ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to delete payment"
            );

        }

    };


    return (

        <div className="payments-page">

            <div className="page-header">

                <div>
                    <h1>Payments</h1>
                    <p>Track member payments, balances and payment types</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={handleAdd}
                >
                    + Add Payment
                </button>

            </div>


            <div className="payments-toolbar">

                <div className="payments-tabs">

                    {TYPE_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "payments-tab active"
                                    : "payments-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <input
                    type="text"
                    className="payments-search"
                    placeholder="Search by member or membership..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>


            {error && (
                <div className="dashboard-error">{error}</div>
            )}

            {actionError && (
                <div className="dashboard-error">{actionError}</div>
            )}


            {loading ? (

                <div className="payments-loading">
                    Loading payments...
                </div>

            ) : filteredPayments.length === 0 ? (

                <div className="payments-empty">
                    No payments found.
                </div>

            ) : (

                <div className="payments-table-card">

                    <table className="payments-table">

                        <thead>

                            <tr>
                                <th>Member</th>
                                <th>Membership</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Rest</th>
                                <th>Type</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredPayments.map((p) => (

                                <tr key={p.id}>

                                    <td>{p.user_name}</td>

                                    <td>{p.membership_name}</td>

                                    <td>
                                        {p.p_date
                                            ? new Date(
                                                p.p_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        {Number(p.amount).toLocaleString()} DA
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                Number(p.rest) <= 0
                                                    ? "rest-paid"
                                                    : "rest-due"
                                            }
                                        >
                                            {Number(p.rest) <= 0
                                                ? "Paid"
                                                : `${Number(p.rest).toLocaleString()} DA due`
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`type-badge type-${p.type}`}
                                        >
                                            {p.type}
                                        </span>
                                    </td>

                                    <td className="payments-actions">

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                handleEdit(p)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn-link btn-danger"
                                            onClick={() =>
                                                handleDelete(p)
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


            {modalMode && (

                <PaymentModal
                    payment={editingPayment}
                    memberships={memberships}
                    users={users}
                    onClose={closeModal}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default PaymentsPage;
