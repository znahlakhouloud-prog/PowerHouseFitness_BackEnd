import MemberStatusBadge from "./MemberStatusBadge";

import {
    getMembershipStatus,
    getRemainingDays
} from "../utils/membershipStatus";

const MembershipCard = ({ membership }) => {

    const status = getMembershipStatus(membership);

    const remaining = getRemainingDays(membership.end_date);

    return (

        <div className="member-membership-card">

            <div className="member-membership-card-header">

                <div>
                    <h3>{membership.name}</h3>
                    <span className="member-membership-type">
                        {membership.type}
                    </span>
                </div>

                <MemberStatusBadge status={status} />

            </div>

            <div className="member-membership-card-body">

                <div className="member-membership-detail">
                    <span>Price</span>
                    <strong>
                        {Number(membership.price).toLocaleString()} DA
                    </strong>
                </div>

                <div className="member-membership-detail">
                    <span>Start Date</span>
                    <strong>
                        {membership.start_date
                            ? new Date(
                                membership.start_date
                            ).toLocaleDateString()
                            : "—"
                        }
                    </strong>
                </div>

                <div className="member-membership-detail">
                    <span>End Date</span>
                    <strong>
                        {membership.end_date
                            ? new Date(
                                membership.end_date
                            ).toLocaleDateString()
                            : "—"
                        }
                    </strong>
                </div>

                <div className="member-membership-detail">
                    <span>Remaining</span>
                    <strong>
                        {remaining !== null
                            ? remaining >= 0
                                ? `${remaining} days`
                                : "Overdue"
                            : "—"
                        }
                    </strong>
                </div>

            </div>

        </div>
    );

};

export default MembershipCard;
