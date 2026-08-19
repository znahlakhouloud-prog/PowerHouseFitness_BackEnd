import {
    useEffect,
    useState
} from "react";

import {
    getEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentReports
} from "../services/equipmentService";

import EquipmentModal from "../components/EquipmentModal";

import "../style/equipmentPage.css";

const STATUS_TABS = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Broken", value: "broken" }
];

const todayISO = () =>
    new Date().toISOString().split("T")[0];

const toDateOnly = (value) =>
    value ? String(value).split("T")[0] : "";

// What quick one-click transitions make sense from each status
const getQuickActions = (state) => {

    if (state === "available") {

        return [
            { label: "Report Broken", targetState: "broken" }
        ];

    }

    if (state === "maintenance") {

        return [
            { label: "Mark Fixed", targetState: "available" }
        ];

    }

    if (state === "broken") {

        return [
            { label: "Send to Maintenance", targetState: "maintenance" },
            { label: "Mark Fixed", targetState: "available" }
        ];

    }

    return [];

};

function EquipmentPage() {

    const [equipments, setEquipments] = useState([]);
    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");

    const [modalMode, setModalMode] = useState(null);
    const [editingEquipment, setEditingEquipment] = useState(null);

    const [actionError, setActionError] = useState("");


    useEffect(() => {

        const fetchAll = async () => {

            try {

                const [equipmentData, reportsData] = await Promise.all([
                    getEquipments(),
                    getEquipmentReports()
                ]);

                setEquipments(equipmentData);
                setReports(reportsData);

            } catch (err) {

                console.error("LOAD EQUIPMENT ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load equipment"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAll();

    }, []);


    const refresh = async () => {

        try {

            const data = await getEquipments();

            setEquipments(data);

        } catch (err) {

            console.error("REFRESH EQUIPMENT ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load equipment"
            );

        }

    };


    const filteredEquipments = equipments.filter((item) =>
        activeTab === "all" || item.state === activeTab
    );


    const handleAdd = () => {

        setEditingEquipment(null);
        setModalMode("add");

    };

    const handleEdit = (item) => {

        setEditingEquipment(item);
        setModalMode("edit");

    };

    const closeModal = () => {

        setModalMode(null);
        setEditingEquipment(null);

    };

    const handleSave = async (id, formData) => {

        if (modalMode === "add") {

            await createEquipment(formData);

        } else {

            await updateEquipment(id, formData);

        }

        closeModal();

        await refresh();

    };


    const handleQuickAction = async (item, targetState) => {

        setActionError("");

        const payload = {
            name: item.name,
            state: targetState,
            maint_date:
                targetState === "available"
                    ? todayISO()
                    : toDateOnly(item.maint_date)
        };

        try {

            await updateEquipment(item.id, payload);

            await refresh();

        } catch (err) {

            console.error("QUICK ACTION ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to update equipment status"
            );

        }

    };


    const handleDelete = async (item) => {

        const confirmed = window.confirm(
            `Delete "${item.name}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {

            await deleteEquipment(item.id);

            await refresh();

        } catch (err) {

            console.error("DELETE EQUIPMENT ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to delete equipment"
            );

        }

    };


    return (

        <div className="equipment-page">

            <div className="page-header">

                <div>
                    <h1>Equipment</h1>
                    <p>Track equipment status and maintenance history</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={handleAdd}
                >
                    + Add Equipment
                </button>

            </div>


            <div className="equipment-toolbar">

                <div className="equipment-tabs">

                    {STATUS_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "equipment-tab active"
                                    : "equipment-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

            </div>


            {error && (
                <div className="dashboard-error">{error}</div>
            )}

            {actionError && (
                <div className="dashboard-error">{actionError}</div>
            )}


            {loading ? (

                <div className="equipment-loading">
                    Loading equipment...
                </div>

            ) : filteredEquipments.length === 0 ? (

                <div className="equipment-empty">
                    No equipment found.
                </div>

            ) : (

                <div className="equipment-table-card">

                    <table className="equipment-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Last Maintenance</th>
                                <th>Status</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredEquipments.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.name}</td>

                                    <td>
                                        {item.maint_date
                                            ? new Date(
                                                item.maint_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge status-${item.state}`}
                                        >
                                            {item.state}
                                        </span>
                                    </td>

                                    <td className="equipment-actions">

                                        {getQuickActions(item.state).map(
                                            (action) => (

                                                <button
                                                    key={action.targetState}
                                                    className="btn-link"
                                                    onClick={() =>
                                                        handleQuickAction(
                                                            item,
                                                            action.targetState
                                                        )
                                                    }
                                                >
                                                    {action.label}
                                                </button>

                                            )
                                        )}

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                handleEdit(item)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn-link btn-danger"
                                            onClick={() =>
                                                handleDelete(item)
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


            <div className="reports-section">

                <div className="page-header">

                    <div>
                        <h2>Recent Equipment Reports</h2>
                        <p>Broken-equipment reports submitted by coaches and members</p>
                    </div>

                </div>

                {reports.length === 0 ? (

                    <div className="equipment-empty">
                        No equipment reports have been submitted.
                    </div>

                ) : (

                    <div className="equipment-table-card">

                        <table className="equipment-table">

                            <thead>

                                <tr>
                                    <th>Equipment</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {reports.map((report) => (

                                    <tr key={report.id}>

                                        <td>{report.equipment_name}</td>

                                        <td>
                                            {report.reported_by}
                                            {" "}
                                            <span style={{ color: "#9aa1ad", textTransform: "capitalize" }}>
                                                ({report.reported_by_role})
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(
                                                report.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>{report.description || "—"}</td>

                                        <td>
                                            <span
                                                className={`status-badge status-${report.status}`}
                                            >
                                                {report.status}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {modalMode && (

                <EquipmentModal
                    equipment={editingEquipment}
                    onClose={closeModal}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default EquipmentPage;
