import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../auth/context/authContext";

import { updateMe } from "../services/memberService";

import "../style/member.css";

function ProfilePage() {

    const { user, updateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        user_name: user?.user_name || "",
        age: user?.age || "",
        email: user?.email || ""
    });

    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleEdit = () => {

        setFormData({
            user_name: user?.user_name || "",
            age: user?.age || "",
            email: user?.email || ""
        });

        setErrors([]);
        setSuccessMessage("");
        setEditing(true);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors([]);
        setSaving(true);

        try {

            await updateMe(formData);

            updateUser({
                user_name: formData.user_name,
                age: Number(formData.age),
                email: formData.email
            });

            setSuccessMessage("Profile updated successfully.");
            setEditing(false);

        } catch (error) {

            console.error("UPDATE PROFILE ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map((err) => err.msg)
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to update profile"
                ]);

            }

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="profile-page">

            <div className="page-header">

                <div>
                    <h1>Profile</h1>
                    <p>Your account information</p>
                </div>

            </div>

            {successMessage && (
                <div className="dashboard-success">{successMessage}</div>
            )}

            <div className="dashboard-card">

                <div className="card-header">
                    <h2>Account Details</h2>

                    {!editing && (
                        <button
                            className="btn-secondary"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                    )}

                </div>

                {editing ? (

                    <form onSubmit={handleSubmit}>

                        {errors.length > 0 && (

                            <div className="modal-errors">
                                {errors.map((msg, i) => (
                                    <p key={i}>{msg}</p>
                                ))}
                            </div>

                        )}

                        <div className="form-field">

                            <label>Full Name</label>

                            <input
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-field">

                            <label>Age</label>

                            <input
                                type="number"
                                name="age"
                                min="1"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-field">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setEditing(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </form>

                ) : (

                    <div className="profile-info-grid">

                        <div className="profile-info-item">
                            <span>Full Name</span>
                            <strong>{user?.user_name}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Email</span>
                            <strong>{user?.email}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Age</span>
                            <strong>{user?.age}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Role</span>
                            <strong>{user?.role}</strong>
                        </div>

                    </div>

                )}

                {!editing && (

                    <button
                        className="btn-primary"
                        onClick={() => navigate("/change-password")}
                    >
                        Change Password
                    </button>

                )}

            </div>

        </div>

    );
}

export default ProfilePage;
