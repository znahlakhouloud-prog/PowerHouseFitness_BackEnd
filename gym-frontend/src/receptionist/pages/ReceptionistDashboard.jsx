import {
    useEffect,
    useMemo,
    useState
} from "react";

import { getMembers } from "../services/memberService";
import { getMemberships } from "../services/membershipService";

import KpiCard from "../../admin/components/KpiCard";
import ExpiringMembershipsTable from "../components/ExpiringMembershipsTable";

import {
    getCurrentMembership,
    getMembershipStatus,
    getRemainingDays
} from "../utils/membershipStatus";

import "../style/receptionist.css";
import "../style/dashboard.css";

const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const isSameMonth = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();

function ReceptionistDashboard() {

    const [members, setMembers] = useState([]);
    const [memberships, setMemberships] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadAll = async () => {

            try {

                const [membersData, membershipsData] =
                    await Promise.all([
                        getMembers(),
                        getMemberships()
                    ]);

                setMembers(membersData);
                setMemberships(membershipsData);

            } catch (err) {

                console.error("LOAD DASHBOARD ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard data"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAll();

    }, []);


    const stats = useMemo(() => {

        const today = new Date();

        let withMembership = 0;
        let active = 0;
        let expired = 0;
        let expiringSoon = 0;

        members.forEach((member) => {

            const current = getCurrentMembership(
                member.id,
                memberships
            );

            if (!current) {
                return;
            }

            // Counted as a "Total Member" as soon as they have any
            // membership row - state is only ever active/expired in
            // the database, "expiring" is just an active membership
            // close to its end date (see membershipStatus.js).
            withMembership++;

            const status = getMembershipStatus(current);

            if (status === "active") {
                active++;
            } else if (status === "expiring") {
                expiringSoon++;
            } else if (status === "expired") {
                expired++;
            }

        });

        const newToday = memberships.filter(
            (m) =>
                m.start_date &&
                isSameDay(new Date(m.start_date), today)
        ).length;

        const newThisMonth = memberships.filter(
            (m) =>
                m.start_date &&
                isSameMonth(new Date(m.start_date), today)
        ).length;

        return {
            total: withMembership,
            active,
            expired,
            expiringSoon,
            newToday,
            newThisMonth
        };

    }, [members, memberships]);


    const expiringRows = useMemo(() => {

        return members
            .map((member) => {

                const current = getCurrentMembership(
                    member.id,
                    memberships
                );

                if (!current) {
                    return null;
                }

                const status = getMembershipStatus(current);

                if (status !== "expiring") {
                    return null;
                }

                return {
                    id_user: member.id,
                    memberName: member.user_name,
                    planName: current.name,
                    end_date: current.end_date,
                    remainingDays: getRemainingDays(current.end_date),
                    status
                };

            })
            .filter(Boolean)
            .sort((a, b) => a.remainingDays - b.remainingDays);

    }, [members, memberships]);


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading dashboard...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="receptionist-dashboard">

            <div className="page-header">

                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Receptionist</p>
                </div>

            </div>


            <div className="kpi-grid receptionist-kpi-grid">

                <KpiCard
                    title="Total Members"
                    value={stats.total}
                />

                <KpiCard
                    title="Active Members"
                    value={stats.active}
                />

                <KpiCard
                    title="Expired Memberships"
                    value={stats.expired}
                />

                <KpiCard
                    title="Expiring Soon"
                    value={stats.expiringSoon}
                />

                <KpiCard
                    title="New Members Today"
                    value={stats.newToday}
                />

                <KpiCard
                    title="New Members This Month"
                    value={stats.newThisMonth}
                />

            </div>


            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Memberships Expiring Soon</h2>
                    <p>Within the next 7 days</p>
                </div>

                <ExpiringMembershipsTable rows={expiringRows} />

            </div>

        </div>

    );
}

export default ReceptionistDashboard;
