import EquipmentStatusBadge from "./EquipmentStatusBadge";

function EquipmentReportTable({
    reports,
    showReporter = false,
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
                        {showReporter && <th>Reported By</th>}
                        <th>Description</th>
                        <th>Reported On</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {reports.map((report) => (

                        <tr key={report.id}>

                            <td>{report.equipment_name}</td>

                            {showReporter && (

                                <td>
                                    {report.reported_by}
                                    {report.reported_by_role && (
                                        <span style={{ color: "#9aa1ad", textTransform: "capitalize" }}>
                                            {" "}({report.reported_by_role})
                                        </span>
                                    )}
                                </td>

                            )}

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
