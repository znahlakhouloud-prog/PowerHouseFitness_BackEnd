import { useEffect, useState } from "react";

import {
    getEquipments,
    reportEquipment,
    getEquipmentReports
} from "../../shared/services/equipmentService";

import EquipmentTable from "../../shared/components/equipment/EquipmentTable";
import EquipmentReportModal from "../../shared/components/equipment/EquipmentReportModal";
import EquipmentReportTable from "../../shared/components/equipment/EquipmentReportTable";

import "../style/receptionist.css";

function EquipmentPage() {

    const [equipments, setEquipments] = useState([]);
    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);


    const loadAll = async () => {

        const [equipmentData, reportsData] = await Promise.all([
            getEquipments(),
            getEquipmentReports()
        ]);

        setEquipments(equipmentData);
        setReports(reportsData);

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
                    <h2>Equipment Reports</h2>
                    <p>Broken-equipment reports submitted by members, coaches and staff</p>
                </div>

                <EquipmentReportTable
                    reports={reports}
                    showReporter
                    emptyMessage="No equipment reports have been submitted."
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
