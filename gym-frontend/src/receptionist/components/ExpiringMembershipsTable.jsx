import { useNavigate } from "react-router-dom";

import MemberStatusBadge from "./MemberStatusBadge";

// rows: [{ id_user, memberName, planName, end_date, remainingDays, status }]
const ExpiringMembershipsTable = ({ rows }) => {

    const navigate = useNavigate();

    if (rows.length === 0) {

        return (
            <div className="receptionist-empty">
                No memberships expiring in the next 7 days.
            </div>
        );

    }

    return (

        <div className="receptionist-table-card">

            <table className="receptionist-table">

                <thead>

                    <tr>
                        <th>Member</th>
                        <th>Membership Plan</th>
                        <th>End Date</th>
                        <th>Remaining Days</th>
                        <th>Status</th>
                        <th></th>
                    </tr>

                </thead>

                <tbody>

                    {rows.map((row) => (

                        <tr key={row.id_user}>

                            <td>{row.memberName}</td>

                            <td>{row.planName}</td>

                            <td>
                                {row.end_date
                                    ? new Date(
                                        row.end_date
                                    ).toLocaleDateString()
                                    : "—"
                                }
                            </td>

                            <td>
                                {row.remainingDays >= 0
                                    ? `${row.remainingDays} days`
                                    : "Overdue"
                                }
                            </td>

                            <td>
                                <MemberStatusBadge
                                    status={row.status}
                                />
                            </td>

                            <td>

                                <button
                                    className="btn-link"
                                    onClick={() =>
                                        navigate(
                                            `/receptionist/members/${row.id_user}`
                                        )
                                    }
                                >
                                    View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default ExpiringMembershipsTable;
