const EXPIRING_SOON_THRESHOLD_DAYS = 7;

const todayStart = () => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;

};

// Days remaining until end_date (negative once past)
export const getRemainingDays = (end_date) => {

    if (!end_date) {
        return null;
    }

    const end = new Date(end_date);

    end.setHours(0, 0, 0, 0);

    const diffMs = end.getTime() - todayStart().getTime();

    return Math.round(diffMs / (1000 * 60 * 60 * 24));

};

/*
 * membership.state in the database is only ever "active" or
 * "expired" - "expiring" is derived here, not stored, based on
 * how many days are left on an otherwise-active membership.
 */
export const getMembershipStatus = (membership) => {

    if (!membership) {
        return "expired";
    }

    if (membership.state === "expired") {
        return "expired";
    }

    const remaining = getRemainingDays(membership.end_date);

    if (
        remaining !== null &&
        remaining <= EXPIRING_SOON_THRESHOLD_DAYS
    ) {
        return "expiring";
    }

    return "active";

};

export const MEMBERSHIP_STATUS_LABELS = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired"
};
