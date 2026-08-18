import { useState } from "react";

const STATE_OPTIONS = [
    "available",
    "maintenance",
    "broken"
];

const todayISO = () =>
    new Date().toISOString().split("T")[0];

function EquipmentModal({ equipment, onClose, onSave }) {

    const isEdit = Boolean(equipment);

    const [formData, setFormData] = useState({
        name: equipment?.name || "",
        maint_date: equipment?.maint_date
            ? String(equipment.maint_date).split("T")[0]
            : todayISO(),
        state: equipment?.state || "available"
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

            await onSave(
                equipment?.id,
                formData
            );

        } catch (error) {

            console.error("SAVE EQUIPMENT ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map(
                        (err) => err.msg
                    )
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to save equipment"
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

                <h2>
                    {isEdit ? "Edit Equipment" : "Add Equipment"}
                </h2>

                {errors.length > 0 && (

                    <div className="modal-errors">

                        {errors.map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}

                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-field">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Treadmill 3"
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Last Maintenance Date</label>

                        <input
                            type="date"
                            name="maint_date"
                            value={formData.maint_date}
                            max={todayISO()}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Status</label>

                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >

                            {STATE_OPTIONS.map((state) => (

                                <option
                                    key={state}
                                    value={state}
                                >
                                    {state.charAt(0).toUpperCase() + state.slice(1)}
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
                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Save Changes"
                                    : "Add Equipment"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default EquipmentModal;
