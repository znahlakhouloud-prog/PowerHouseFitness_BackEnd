import { useEffect, useState } from "react";

import {
    getEquipments,
    reportEquipment,
    getMyEquipmentReports
} from "../../shared/services/equipmentService";

import EquipmentTable from "../../shared/components/equipment/EquipmentTable";
import EquipmentReportModal from "../../shared/components/equipment/EquipmentReportModal";
import EquipmentReportTable from "../../shared/components/equipment/EquipmentReportTable";

import "../style/coach.css";

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
            <div className="coach-loading">
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

                <EquipmentTable equipments={equipments} />

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>My Equipment Reports</h2>
                </div>

                <EquipmentReportTable
                    reports={myReports}
                    emptyMessage="You haven't reported any equipment issues."
                />

            </div>


            {modalOpen && (

                <EquipmentReportModal
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default EquipmentPage;
