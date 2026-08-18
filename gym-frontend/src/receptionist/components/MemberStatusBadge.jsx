import { MEMBERSHIP_STATUS_LABELS } from "../utils/membershipStatus";

const MemberStatusBadge = ({ status }) => {

    return (
        <span className={`status-badge status-${status}`}>
            {MEMBERSHIP_STATUS_LABELS[status] || status}
        </span>
    );

};

export default MemberStatusBadge;
