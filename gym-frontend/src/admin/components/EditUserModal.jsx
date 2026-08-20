import { useState } from "react";

import { calculateAge, formatDateOnly } from "../../shared/utils/dateUtils";

const ROLE_OPTIONS = [
    "member",
    "coach",
    "employee",
    "receptionist"
];

function EditUserModal({ user, onClose, onSave }) {

    // email and birth_date are authentication/identity data and are
    // intentionally excluded here - they're never sent to the backend
    // on save (which ignores them regardless), only shown read-only.
    const [formData, setFormData] = useState({
        user_name: user.user_name,
        role: user.role
    });

    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors([]);
        setSaving(true);

        try {

            await onSave(user.id, formData);

        } catch (error) {

            console.error("EDIT USER ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map(
                        (err) => err.msg
                    )
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to update user"
                ]);

            }

        } finally {

            setSaving(false);

        }

    };

    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <h2>Edit User</h2>

                {errors.length > 0 && (

                    <div className="modal-errors">

                        {errors.map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}

                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-field">

                        <label>User name</label>

                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Email (read-only)</label>

                        <input
                            type="email"
                            value={user.email}
                            disabled
                            readOnly
                        />

                    </div>

                    <div className="form-field">

                        <label>Birth Date (read-only)</label>

                        <input
                            type="text"
                            value={`${formatDateOnly(user.birth_date)} (age ${calculateAge(user.birth_date)})`}
                            disabled
                            readOnly
                        />

                    </div>

                    <div className="form-field">

                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            {ROLE_OPTIONS.map((role) => (

                                <option
                                    key={role}
                                    value={role}
                                >
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
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

            </div>

        </div>

    );
}

export default EditUserModal;
