import {
    useEffect,
    useState
} from "react";

import {
    getEquipments,
    reportEquipmentBroken
} from "../services/equipmentService";

import "../style/receptionist.css";

const STATUS_TABS = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Broken", value: "broken" }
];

function EquipmentPage() {

    const [equipments, setEquipments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [reportingId, setReportingId] = useState(null);


    const loadEquipments = async () => {

        try {

            const data = await getEquipments();

            setEquipments(data);

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

    useEffect(() => {

        loadEquipments();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const filteredEquipments = equipments.filter(
        (item) =>
            activeTab === "all" || item.state === activeTab
    );


    const handleReportBroken = async (item) => {

        const confirmed = window.confirm(
            `Report "${item.name}" as broken?`
        );

        if (!confirmed) {
            return;
        }

        setActionError("");
        setReportingId(item.id);

        try {

            await reportEquipmentBroken(item.id);

            await loadEquipments();

        } catch (err) {

            console.error("REPORT BROKEN ERROR:", err);

            setActionError(
                err.response?.data?.message ||
                "Failed to report equipment as broken"
            );

        } finally {

            setReportingId(null);

        }

    };


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading equipment...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="equipment-page">

            <div className="page-header">

                <div>
                    <h1>Equipment</h1>
                    <p>Report broken equipment to the admin team</p>
                </div>

            </div>


            <div className="members-toolbar">

                <div className="members-tabs">

                    {STATUS_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "members-tab active"
                                    : "members-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

            </div>


            {actionError && (
                <div className="dashboard-error">{actionError}</div>
            )}


            {filteredEquipments.length === 0 ? (

                <div className="receptionist-empty">
                    No equipment found.
                </div>

            ) : (

                <div className="receptionist-table-card">

                    <table className="receptionist-table">

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

                                    <td>

                                        {item.state === "broken" ? (

                                            <span className="no-membership">
                                                Already reported
                                            </span>

                                        ) : (

                                            <button
                                                className="btn-link btn-danger"
                                                disabled={
                                                    reportingId === item.id
                                                }
                                                onClick={() =>
                                                    handleReportBroken(item)
                                                }
                                            >
                                                {reportingId === item.id
                                                    ? "Reporting..."
                                                    : "Report Broken"
                                                }
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default EquipmentPage;
