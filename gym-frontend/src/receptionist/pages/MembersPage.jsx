import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { getMembers } from "../services/memberService";
import { getMemberships } from "../services/membershipService";

import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import MemberStatusBadge from "../components/MemberStatusBadge";

import {
    getCurrentMembership,
    getMembershipStatus
} from "../utils/membershipStatus";

import "../style/receptionist.css";
import "../style/members.css";

const STATUS_TABS = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expiring Soon", value: "expiring" },
    { label: "Expired", value: "expired" }
];

const PAGE_SIZE = 10;

function MembersPage() {

    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [memberships, setMemberships] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);


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

                console.error("LOAD MEMBERS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load members"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAll();

    }, []);


    const enrichedMembers = members.map((member) => {

        const currentMembership = getCurrentMembership(
            member.id,
            memberships
        );

        const status = currentMembership
            ? getMembershipStatus(currentMembership)
            : null;

        return {
            ...member,
            currentMembership,
            status
        };

    });

    const filteredMembers = enrichedMembers.filter((member) => {

        const matchesTab =
            activeTab === "all" || member.status === activeTab;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term ||
            member.user_name.toLowerCase().includes(term) ||
            member.email.toLowerCase().includes(term);

        return matchesTab && matchesSearch;

    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMembers.length / PAGE_SIZE)
    );

    const pageMembers = filteredMembers.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleTabChange = (tab) => {

        setActiveTab(tab);
        setPage(1);

    };

    const handleSearchChange = (value) => {

        setSearch(value);
        setPage(1);

    };


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading members...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="members-page">

            <div className="page-header">

                <div>
                    <h1>Members</h1>
                    <p>Search and follow every member's status</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={() =>
                        navigate("/receptionist/members/new")
                    }
                >
                    + Register Member
                </button>

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
                            onClick={() =>
                                handleTabChange(tab.value)
                            }
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <SearchBar
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name or email..."
                />

            </div>


            {pageMembers.length === 0 ? (

                <div className="receptionist-empty">
                    No members found.
                </div>

            ) : (

                <div className="receptionist-table-card">

                    <table className="receptionist-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Membership Status</th>
                                <th>Membership End Date</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {pageMembers.map((member) => (

                                <tr key={member.id}>

                                    <td>{member.user_name}</td>

                                    <td>{member.email}</td>

                                    <td>{member.age}</td>

                                    <td>
                                        {member.status ? (
                                            <MemberStatusBadge
                                                status={member.status}
                                            />
                                        ) : (
                                            <span className="no-membership">
                                                No membership
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {member.currentMembership?.end_date
                                            ? new Date(
                                                member.currentMembership.end_date
                                            ).toLocaleDateString()
                                            : "—"
                                        }
                                    </td>

                                    <td className="members-actions">

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                navigate(
                                                    `/receptionist/members/${member.id}`
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn-link"
                                            onClick={() =>
                                                navigate(
                                                    `/receptionist/members/${member.id}#membership`
                                                )
                                            }
                                        >
                                            View Membership
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>

    );
}

export default MembersPage;
