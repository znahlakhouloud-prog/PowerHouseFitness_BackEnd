import { useState } from "react";

const emptyOption = () => ({
    nbr_sessions: "",
    price: ""
});

function PlanModal({ plan, onClose, onSave }) {

    const isEdit = Boolean(plan);

    const [name, setName] = useState(plan?.name || "");
    const [type, setType] = useState(plan?.type || "");

    const [options, setOptions] = useState(
        plan?.options?.length
            ? plan.options.map((opt) => ({
                nbr_sessions: opt.nbr_sessions,
                price: opt.price
            }))
            : [emptyOption()]
    );

    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    const handleOptionChange = (index, field, value) => {

        setOptions(
            options.map((opt, i) =>
                i === index
                    ? { ...opt, [field]: value }
                    : opt
            )
        );

    };

    const addOptionRow = () => {

        setOptions([...options, emptyOption()]);

    };

    const removeOptionRow = (index) => {

        if (options.length <= 1) {
            return;
        }

        setOptions(
            options.filter((_, i) => i !== index)
        );

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors([]);
        setSaving(true);

        try {

            await onSave(
                plan?.id,
                { name, type, options }
            );

        } catch (error) {

            console.error("SAVE PLAN ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map(
                        (err) => err.msg
                    )
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to save plan"
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
                    {isEdit ? "Edit Plan" : "Add Plan"}
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

                        <label>Plan Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. Basic, Premium, VIP"
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Type</label>

                        <input
                            type="text"
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                            placeholder="e.g. monthly, trimestry, annually"
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Session / Price Options</label>

                        <div className="option-rows">

                            {options.map((opt, index) => (

                                <div
                                    className="option-row"
                                    key={index}
                                >

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Sessions"
                                        value={opt.nbr_sessions}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                "nbr_sessions",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Price"
                                        value={opt.price}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="option-remove"
                                        onClick={() =>
                                            removeOptionRow(index)
                                        }
                                        disabled={options.length <= 1}
                                        title="Remove option"
                                    >
                                        ×
                                    </button>

                                </div>

                            ))}

                        </div>

                        <button
                            type="button"
                            className="btn-link"
                            onClick={addOptionRow}
                        >
                            + Add option
                        </button>

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
                                    : "Add Plan"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default PlanModal;
