import { useState } from "react";

const todayISO = () =>
    new Date().toISOString().split("T")[0];

function EquipmentReportModal({ onClose, onSave }) {

    const [formData, setFormData] = useState({
        equipment_name: "",
        description: ""
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

            await onSave(formData);

        } catch (error) {

            console.error("REPORT EQUIPMENT ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map((err) => err.msg)
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to submit report"
                ]);

            }

        } finally {

            setSaving(false);

        }

    };

    return (

        <div className="modal-overlay" onClick={onClose}>

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <h2>Report Broken Equipment</h2>

                {errors.length > 0 && (

                    <div className="modal-errors">
                        {errors.map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-field">

                        <label>Equipment Name</label>

                        <input
                            type="text"
                            name="equipment_name"
                            value={formData.equipment_name}
                            onChange={handleChange}
                            placeholder="e.g. Treadmill #03"
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>State / Description</label>

                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue..."
                        />

                    </div>

                    <div className="form-field">

                        <label>Date</label>

                        <input
                            type="text"
                            value={new Date(todayISO()).toLocaleDateString()}
                            disabled
                        />

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
                            {saving ? "Submitting..." : "Submit Report"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EquipmentReportModal;
