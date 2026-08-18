import { useEffect, useState } from "react";

import {
    getEquipments,
    reportEquipment,
    getMyEquipmentReports
} from "../services/equipmentService";

import BrokenEquipmentModal from "../components/BrokenEquipmentModal";

import "../style/member.css";

function EquipmentPage() {

    const [equipments, setEquipments] = useState([]);
    const [myReports, setMyReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);


    const loadAll = async () => {

        const [equipmentData, reportsData] = await Promise.all([
            getEquipments(),
            getMyEquipmentReports()
        ]);

        setEquipments(equipmentData);
        setMyReports(reportsData);

    };


    useEffect(() => {

        const load = async () => {

            try {

                await loadAll();

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

        load();

    }, []);


    const handleSave = async (data) => {

        await reportEquipment(data);

        setModalOpen(false);

        await loadAll();

    };


    if (loading) {

        return (
            <div className="member-loading">
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
                    <p>View gym equipment and report any issues</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={() => setModalOpen(true)}
                >
                    Report Broken Equipment
                </button>

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Equipment</h2>
                </div>

                {equipments.length === 0 ? (

                    <div className="member-empty">
                        No equipment found.
                    </div>

                ) : (

                    <div className="member-table-card">

                        <table className="member-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {equipments.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.name}</td>

                                        <td>
                                            <span
                                                className={`status-badge status-${item.state}`}
                                            >
                                                {item.state}
                                            </span>
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
                    <h2>My Equipment Reports</h2>
                </div>

                {myReports.length === 0 ? (

                    <div className="member-empty">
                        You haven't reported any equipment issues.
                    </div>

                ) : (

                    <div className="member-table-card">

                        <table className="member-table">

                            <thead>

                                <tr>
                                    <th>Equipment</th>
                                    <th>Description</th>
                                    <th>Reported On</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {myReports.map((report) => (

                                    <tr key={report.id}>

                                        <td>{report.equipment_name}</td>

                                        <td>{report.description || "—"}</td>

                                        <td>
                                            {new Date(
                                                report.created_at
                                            ).toLocaleDateString()}
                                        </td>

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


            {modalOpen && (

                <BrokenEquipmentModal
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default EquipmentPage;
