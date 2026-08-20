import { useState } from "react";

const todayISO = () =>
    new Date().toISOString().split("T")[0];

const ROLE_LABELS = {
    receptionist: "Receptionist",
    employee: "Employee",
    coach: "Coach",
    member: "Member"
};

const PAYMENT_TYPE_LABELS = {
    cash: "Cash",
    card: "Card",
    transfer: "Bank Transfer"
};

const getSubmitLabel = (roleOptions, loading) => {

    if (loading) {
        return "Registering...";
    }

    return roleOptions.length === 1
        ? `Register ${ROLE_LABELS[roleOptions[0]] || "User"}`
        : "Register User";

};

// Preview only - the backend recomputes this from the real plan
// row and never trusts a client-supplied duration.
const previewEndDate = (startDate, durationDays) => {

    if (!startDate || !durationDays) {
        return null;
    }

    const start = new Date(startDate);
    const end = new Date(start);

    end.setDate(start.getDate() + durationDays);

    return end.toLocaleDateString();

};

/*
 * Generalized from the original Receptionist "Register Member" form.
 * When roleOptions has exactly one value, no role selector is shown
 * and the role is silently locked to it - this is what keeps the
 * Receptionist page's behavior/appearance unchanged. Admin passes
 * multiple roleOptions to get a real selector. The membership/payment
 * section only ever applies to the "member" role, regardless of who's
 * using the form.
 *
 * Only id_plan (the real plan row id) and the payment amount/type are
 * ever sent for the membership/payment - price, duration, name and
 * type are always derived server-side from the real plan, never
 * trusted from this form. The "Total/Paid/Remaining" preview below is
 * for the user's convenience only; the backend recalculates it.
 */
const RegisterUserForm = ({
    roleOptions,
    onSubmit,
    loading,
    error,
    plans
}) => {

    const [formData, setFormData] = useState({
        user_name: "",
        birth_date: "",
        email: ""
    });

    const [role, setRole] = useState(roleOptions[0]);

    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");

    const [startDate, setStartDate] = useState(todayISO());
    const [paymentType, setPaymentType] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");

    const showRoleSelector = roleOptions.length > 1;
    const showPlanPicker = role === "member";

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleRoleChange = (e) => {

        setRole(e.target.value);
        setSelectedPlanId("");
        setSelectedOptionId("");
        setAmountPaid("");

    };

    const handlePlanChange = (e) => {

        setSelectedPlanId(e.target.value);
        setSelectedOptionId("");
        setAmountPaid("");

    };

    const selectedPlan = plans.find(
        (p) => String(p.id) === selectedPlanId
    );

    const selectedOption = selectedPlan?.options.find(
        (opt) => String(opt.id) === selectedOptionId
    );

    const totalPrice = selectedOption ? Number(selectedOption.price) : 0;
    const paidAmount = amountPaid ? Number(amountPaid) : 0;
    const remainingAmount = Math.max(0, totalPrice - paidAmount);


    const handleSubmit = (e) => {

        e.preventDefault();

        let membership = null;
        let payment = null;

        if (showPlanPicker && selectedOption) {

            membership = {
                id_plan: Number(selectedOption.id),
                start_date: startDate,
                duration_promo: 0
            };

            if (paidAmount > 0) {

                payment = {
                    amount: paidAmount,
                    type: paymentType
                };

            }

        }

        onSubmit({
            ...formData,
            role,
            membership,
            payment
        });

    };

    return (

        <form
            className="register-member-form"
            onSubmit={handleSubmit}
        >

            {error && (
                <div className="dashboard-error">{error}</div>
            )}

            <div className="register-form-section">

                <h3 className="register-form-section-title">
                    Member Information
                </h3>

                <div className="form-field">

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                    />

                </div>

                <div className="form-field">

                    <label>Birth Date</label>

                    <input
                        type="date"
                        name="birth_date"
                        max={todayISO()}
                        value={formData.birth_date}
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
                        placeholder="user@example.com"
                        required
                    />

                </div>

                {showRoleSelector && (

                    <div className="form-field">

                        <label>User Role</label>

                        <select
                            value={role}
                            onChange={handleRoleChange}
                        >

                            {roleOptions.map((r) => (

                                <option key={r} value={r}>
                                    {ROLE_LABELS[r] || r}
                                </option>

                            ))}

                        </select>

                    </div>

                )}

            </div>

            {showPlanPicker && (

                <div className="register-form-section">

                    <h3 className="register-form-section-title">
                        Membership
                    </h3>

                    <div className="form-field">

                        <label>Membership Plan (optional)</label>

                        <select
                            value={selectedPlanId}
                            onChange={handlePlanChange}
                        >

                            <option value="">
                                No plan — assign later
                            </option>

                            {plans.map((plan) => (

                                <option
                                    key={plan.id}
                                    value={plan.id}
                                >
                                    {plan.name} — {plan.type}
                                </option>

                            ))}

                        </select>

                    </div>

                    {selectedPlan && (

                        <div className="form-field">

                            <label>Duration / Offer</label>

                            <select
                                value={selectedOptionId}
                                onChange={(e) =>
                                    setSelectedOptionId(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select sessions / price
                                </option>

                                {selectedPlan.options.map((opt) => (

                                    <option
                                        key={opt.id}
                                        value={opt.id}
                                    >
                                        {opt.nbr_sessions} sessions —{" "}
                                        {Number(opt.price).toLocaleString()} DA
                                    </option>

                                ))}

                            </select>

                        </div>

                    )}

                    {selectedOption && (

                        <>

                            <div className="form-field">

                                <label>Start Date</label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="register-membership-preview">

                                <div>
                                    <span>Duration</span>
                                    <strong>{selectedPlan.duration_days} days</strong>
                                </div>

                                <div>
                                    <span>End Date</span>
                                    <strong>
                                        {previewEndDate(
                                            startDate,
                                            selectedPlan.duration_days
                                        ) || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Total Price</span>
                                    <strong>
                                        {totalPrice.toLocaleString()} DA
                                    </strong>
                                </div>

                            </div>

                        </>

                    )}

                </div>

            )}

            {selectedOption && (

                <div className="register-form-section">

                    <h3 className="register-form-section-title">
                        Payment
                    </h3>

                    <div className="form-field">

                        <label>Payment Method</label>

                        <select
                            value={paymentType}
                            onChange={(e) =>
                                setPaymentType(e.target.value)
                            }
                        >

                            {Object.entries(PAYMENT_TYPE_LABELS).map(
                                ([value, label]) => (

                                    <option key={value} value={value}>
                                        {label}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="form-field">

                        <label>Amount Paid / Versement (optional)</label>

                        <input
                            type="number"
                            min="0"
                            max={totalPrice}
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) =>
                                setAmountPaid(e.target.value)
                            }
                            placeholder="Leave blank to record payment later"
                        />

                    </div>

                    <div className="register-payment-summary">

                        <div>
                            <span>Total</span>
                            <strong>{totalPrice.toLocaleString()} DA</strong>
                        </div>

                        <div>
                            <span>Paid</span>
                            <strong>{paidAmount.toLocaleString()} DA</strong>
                        </div>

                        <div className="register-payment-summary-remaining">
                            <span>Remaining</span>
                            <strong>{remainingAmount.toLocaleString()} DA</strong>
                        </div>

                    </div>

                </div>

            )}

            <button
                type="submit"
                className="btn-primary"
                disabled={loading}
            >
                {getSubmitLabel(roleOptions, loading)}
            </button>

        </form>

    );

};

export default RegisterUserForm;
