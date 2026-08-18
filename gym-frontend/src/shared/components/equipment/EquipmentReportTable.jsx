import EquipmentStatusBadge from "./EquipmentStatusBadge";

function EquipmentReportTable({
    reports,
    emptyMessage = "No equipment reports yet."
}) {

    if (reports.length === 0) {

        return (
            <div className="equipment-empty">
                {emptyMessage}
            </div>
        );

    }

    return (

        <div className="equipment-table-card">

            <table className="equipment-table">

                <thead>

                    <tr>
                        <th>Equipment</th>
                        <th>Description</th>
                        <th>Reported On</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {reports.map((report) => (

                        <tr key={report.id}>

                            <td>{report.equipment_name}</td>

                            <td>{report.description || "—"}</td>

                            <td>
                                {new Date(
                                    report.created_at
                                ).toLocaleDateString()}
                            </td>

                            <td>
                                <EquipmentStatusBadge status={report.status} />
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default EquipmentReportTable;
