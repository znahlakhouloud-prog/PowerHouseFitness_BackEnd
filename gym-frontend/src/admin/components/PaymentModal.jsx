import { useState } from "react";

const todayISO = () =>
    new Date().toISOString().split("T")[0];

const TYPE_LABELS = {
    cash: "Cash",
    card: "Card (legacy)",
    transfer: "Bank Transfer (legacy)"
};

function PaymentModal({
    payment,
    memberships,
    users,
    onClose,
    onSave
}) {

    const isEdit = Boolean(payment);

    // Cash is the only payment method the application creates going
    // forward - there is no method field to fill in. Editing an
    // existing payment never changes its method either (the backend
    // preserves it regardless of what's sent), so a legacy card/
    // transfer row is only ever shown here, never editable.
    const [formData, setFormData] = useState({
        id_membership: payment?.id_membership || "",
        amount: payment?.amount || "",
        p_date: payment?.p_date
            ? String(payment.p_date).split("T")[0]
            : todayISO()
    });

    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    const membershipOptions = memberships.map((m) => {

        const owner = users.find(
            (u) => u.id === m.id_user
        );

        return {
            id: m.id,
            label:
                `${owner?.user_name || "Unknown member"} — ` +
                `${m.name} (${m.state})`
        };

    });

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
                payment?.id,
                formData
            );

        } catch (error) {

            console.error("SAVE PAYMENT ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map(
                        (err) => err.msg
                    )
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Failed to save payment"
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
                    {isEdit ? "Edit Payment" : "Add Payment"}
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

                        <label>Membership</label>

                        <select
                            name="id_membership"
                            value={formData.id_membership}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select membership
                            </option>

                            {membershipOptions.map((opt) => (

                                <option
                                    key={opt.id}
                                    value={opt.id}
                                >
                                    {opt.label}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="form-field">

                        <label>Amount</label>

                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            min="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Payment Date</label>

                        <input
                            type="date"
                            name="p_date"
                            value={formData.p_date}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Payment Method</label>

                        <div className="register-payment-method-fixed">
                            {isEdit
                                ? (TYPE_LABELS[payment.type] || payment.type)
                                : "Cash"
                            }
                        </div>

                        {isEdit && payment.type !== "cash" && (

                            <p className="form-hint">
                                This is a historical record created before
                                Card/Bank Transfer were removed - its payment
                                method is preserved and can't be changed.
                            </p>

                        )}

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
                                    : "Add Payment"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default PaymentModal;
