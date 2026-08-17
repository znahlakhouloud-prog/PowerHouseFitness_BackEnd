import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan
} from "../services/planService";

import PlanModal from "../components/PlanModal";

import "../style/membershipsPage.css";

function MembershipsPage() {

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const [modalMode, setModalMode] = useState(null);
    const [editingPlan, setEditingPlan] = useState(null);

    const [actionError, setActionError] = useState("");


    const loadPlans = async () => {

        try {

            setError("");

            const data = await getPlans();

            setPlans(data);

        } catch (err) {

            console.error("LOAD PLANS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load plans"
            );

        }

    };

    useEffect(() => {

        const initialLoad = async () => {

            await loadPlans();

            setLoading(false);

        };

        initialLoad();

    }, []);


    const typeTabs = useMemo(() => {

        const uniqueTypes = [
            ...new Set(plans.map((p) => p.type))
        ];

        return [
            { label: "All", value: "all" },
            ...uniqueTypes.map((type) => ({
                label: type.charAt(0).toUpperCase() + type.slice(1),
                value: type
            }))
        ];

    }, [plans]);


    const filteredPlans = plans.filter((p) => {

        const matchesTab =
            activeTab === "all" || p.type === activeTab;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term || p.name.toLowerCase().includes(term);

        return matchesTab && matchesSearch;

    });


    const handleAdd = () => {

        setEditingPlan(null);
        setModalMode("add");

    };

    const handleEdit = (plan) => {

        setEditingPlan(plan);
        setModalMode("edit");

    };

    const closeModal = () => {

        setModalMode(null);
        setEditingPlan(null);

    };

    const handleSave = async (id, formData) => {

        if (modalMode === "add") {

            await createPlan(formData);

        } else {

            await updatePlan(id, formData);

        }

        closeModal();

        await loadPlans();

    };


    const handleDelete = async (plan) => {

        const confirmed = window.confirm(
            `Delete the "${plan.name}" plan? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {

            await deletePlan(plan.id);

            await loadPlans();

        } catch (err) {

            console.error("DELETE PLAN ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to delete plan"
            );

        }

    };


    return (

        <div className="memberships-page">

            <div className="page-header">

                <div>
                    <h1>Membership Plans</h1>
                    <p>Manage the plans offered at the gym</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={handleAdd}
                >
                    + Add Plan
                </button>

            </div>


            <div className="memberships-toolbar">

                <div className="memberships-tabs">

                    {typeTabs.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "memberships-tab active"
                                    : "memberships-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <input
                    type="text"
                    className="memberships-search"
                    placeholder="Search by plan name..."
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

                <div className="memberships-loading">
                    Loading plans...
                </div>

            ) : filteredPlans.length === 0 ? (

                <div className="memberships-empty">
                    No plans found.
                </div>

            ) : (

                <div className="plans-grid">

                    {filteredPlans.map((plan) => (

                        <div
                            className="plan-card"
                            key={plan.id}
                        >

                            <div className="plan-card-header">

                                <div>
                                    <h3>{plan.name}</h3>
                                    <span className="status-badge status-type">
                                        {plan.type}
                                    </span>
                                </div>

                                <div className="plan-card-actions">

                                    <button
                                        className="btn-link"
                                        onClick={() =>
                                            handleEdit(plan)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn-link btn-danger"
                                        onClick={() =>
                                            handleDelete(plan)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                            <div className="plan-options-list">

                                {plan.options.map((opt) => (

                                    <div
                                        className="plan-option-row"
                                        key={opt.id}
                                    >

                                        <span>
                                            {opt.nbr_sessions} sessions
                                        </span>

                                        <strong>
                                            {Number(opt.price).toLocaleString()} DA
                                        </strong>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {modalMode && (

                <PlanModal
                    plan={editingPlan}
                    onClose={closeModal}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default MembershipsPage;
