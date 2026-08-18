import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { getMembers } from "../services/memberService";
import { getMemberships } from "../services/membershipService";

import SearchBar from "../components/SearchBar";
import MemberStatusBadge from "../components/MemberStatusBadge";

import {
    getMembershipStatus,
    getRemainingDays
} from "../utils/membershipStatus";

import "../style/receptionist.css";
import "../style/memberships.css";

const STATUS_TABS = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expiring Soon", value: "expiring" },
    { label: "Expired", value: "expired" }
];

function MembershipsPage() {

    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [memberships, setMemberships] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");


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

                console.error("LOAD MEMBERSHIPS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load memberships"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAll();

    }, []);


    const getMemberName = (id_user) =>
        members.find((m) => m.id === id_user)?.user_name ||
        "Unknown member";


    const enrichedMemberships = memberships.map((m) => ({
        ...m,
        memberName: getMemberName(m.id_user),
        status: getMembershipStatus(m),
        remainingDays: getRemainingDays(m.end_date)
    }));

    const filteredMemberships = enrichedMemberships
        .filter((m) => {

            const matchesTab =
                activeTab === "all" || m.status === activeTab;

            const term = search.trim().toLowerCase();

            const matchesSearch =
                !term ||
                m.memberName.toLowerCase().includes(term) ||
                m.name.toLowerCase().includes(term);

            return matchesTab && matchesSearch;

        })
        .sort((a, b) => a.remainingDays - b.remainingDays);


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading memberships...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="memberships-page">

            <div className="page-header">

                <div>
                    <h1>Memberships</h1>
                    <p>Follow every membership's status at a glance</p>
                </div>

            </div>


            <div className="members-toolbar">

                <div className="members-tabs">

                    {STATUS_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "members-tab active"
                                    : "members-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by member or plan..."
                />

            </div>


            {filteredMemberships.length === 0 ? (

                <div className="receptionist-empty">
                    No memberships found.
                </div>

            ) : (

                <div className="receptionist-table-card">

                    <table className="receptionist-table">

                        <thead>

                            <tr>
                                <th>Member</th>
                                <th>Plan</th>
                                <th>Type</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Remaining</th>
                                <th>Status</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredMemberships.map((m) => (

                                <tr key={m.id}>

                                    <td>{m.memberName}</td>

                                    <td>{m.name}</td>

                                    <td>{m.type}</td>

                                    <td>
                                        {m.start_date
                                            ? new Date(
                                                m.start_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        {m.end_date
                                            ? new Date(
                                                m.end_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td>
                                        {m.remainingDays >= 0
                                            ? `${m.remainingDays} days`
                                            : "Overdue"
                                        }
                                    </td>

                                    <td>
                                        <MemberStatusBadge
                                            status={m.status}
                                        />
                                    </td>

                                    <td>

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                navigate(
                                                    `/receptionist/members/${m.id_user}`
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

            )}

        </div>

    );
}

export default MembershipsPage;
