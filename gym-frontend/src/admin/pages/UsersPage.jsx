import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    getUsers,
    updateUser,
    deleteUser
} from "../services/userService";

import { getMemberships } from "../services/membershipService";

import {
    getMembershipStatus,
    getCurrentMembership
} from "../utils/membershipStatus";

import EditUserModal from "../components/EditUserModal";

import "../style/usersPage.css";

const ROLE_TABS = [
    { label: "All", value: "all" },
    { label: "Members", value: "member" },
    { label: "Coaches", value: "coach" },
    { label: "Receptionists", value: "receptionist" },
    { label: "Employees", value: "employee" }
];

const MANAGED_ROLES = [
    "member",
    "coach",
    "receptionist",
    "employee"
];

const STATUS_LABELS = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired"
};

function UsersPage() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [memberships, setMemberships] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const [editingUser, setEditingUser] = useState(null);
    const [deleteError, setDeleteError] = useState("");


    const loadUsers = async () => {

        try {

            setError("");

            const [usersData, membershipsData] = await Promise.all([
                getUsers(),
                getMemberships()
            ]);

            // This page only manages non-admin accounts
            setUsers(
                usersData.filter((u) =>
                    MANAGED_ROLES.includes(u.role)
                )
            );

            setMemberships(membershipsData);

        } catch (err) {

            console.error("LOAD USERS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load users"
            );

        }

    };

    useEffect(() => {

        const initialLoad = async () => {

            await loadUsers();

            setLoading(false);

        };

        initialLoad();

    }, []);


    const filteredUsers = users.filter((u) => {

        const matchesTab =
            activeTab === "all" || u.role === activeTab;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term ||
            u.user_name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term);

        return matchesTab && matchesSearch;

    });


    const handleSave = async (id, formData) => {

        await updateUser(id, formData);

        setEditingUser(null);

        await loadUsers();

    };


    const handleDelete = async (user) => {

        const confirmed = window.confirm(
            `Delete ${user.user_name}? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setDeleteError("");

        try {

            await deleteUser(user.id);

            await loadUsers();

        } catch (err) {

            console.error("DELETE USER ERROR:", err);

            const message = err.response?.data?.message || "";

            const isForeignKeyError =
                /foreign key|constraint/i.test(message);

            setDeleteError(
                isForeignKeyError
                    ? "Can't delete this user — they have related records (memberships, payments, attendance, etc.). Remove those first."
                    : message || "Failed to delete user"
            );

        }

    };


    return (

        <div className="users-page">

            <div className="page-header">

                <div>
                    <h1>Users</h1>
                    <p>Manage members, coaches, receptionists and employees</p>
                </div>

                <button
                    className="dashboard-action-button"
                    onClick={() => navigate("/admin/users/new")}
                >
                    + Add User
                </button>

            </div>


            <div className="users-toolbar">

                <div className="users-tabs">

                    {ROLE_TABS.map((tab) => (

                        <button
                            key={tab.value}
                            className={
                                activeTab === tab.value
                                    ? "users-tab active"
                                    : "users-tab"
                            }
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                <input
                    type="text"
                    className="users-search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>


            {error && (
                <div className="dashboard-error">{error}</div>
            )}

            {deleteError && (
                <div className="dashboard-error">{deleteError}</div>
            )}


            {loading ? (

                <div className="users-loading">
                    Loading users...
                </div>

            ) : filteredUsers.length === 0 ? (

                <div className="users-empty">
                    No users found.
                </div>

            ) : (

                <div className="users-table-card">

                    <table className="users-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredUsers.map((u) => {

                                const current = u.role === "member"
                                    ? getCurrentMembership(u.id, memberships)
                                    : null;

                                const status = getMembershipStatus(current);

                                return (

                                    <tr key={u.id}>

                                        <td>{u.user_name}</td>

                                        <td>{u.email}</td>

                                        <td>
                                            <span
                                                className={`role-badge role-${u.role}`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>

                                        <td>
                                            {status ? (
                                                <span
                                                    className={`status-badge status-${status}`}
                                                >
                                                    {STATUS_LABELS[status]}
                                                </span>
                                            ) : (
                                                <span className="no-membership">—</span>
                                            )}
                                        </td>

                                        <td className="users-actions">

                                            <button
                                                className="btn-link"
                                                onClick={() =>
                                                    setEditingUser(u)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn-link btn-danger"
                                                onClick={() =>
                                                    handleDelete(u)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            )}


            {editingUser && (

                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSave}
                />

            )}

        </div>

    );
}

export default UsersPage;
