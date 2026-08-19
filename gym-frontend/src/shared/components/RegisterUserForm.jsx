import { useState } from "react";

const ROLE_LABELS = {
    receptionist: "Receptionist",
    employee: "Employee",
    coach: "Coach",
    member: "Member"
};

const getSubmitLabel = (roleOptions, loading) => {

    if (loading) {
        return "Registering...";
    }

    return roleOptions.length === 1
        ? `Register ${ROLE_LABELS[roleOptions[0]] || "User"}`
        : "Register User";

};

/*
 * Generalized from the original Receptionist "Register Member" form.
 * When roleOptions has exactly one value, no role selector is shown
 * and the role is silently locked to it - this is what keeps the
 * Receptionist page's behavior/appearance unchanged. Admin passes
 * multiple roleOptions to get a real selector. The membership-plan
 * picker only ever applies to the "member" role, regardless of who's
 * using the form.
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
        age: "",
        email: ""
    });

    const [role, setRole] = useState(roleOptions[0]);

    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");

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

    };

    const handlePlanChange = (e) => {

        setSelectedPlanId(e.target.value);
        setSelectedOptionId("");

    };

    const selectedPlan = plans.find(
        (p) => String(p.id) === selectedPlanId
    );

    const handleSubmit = (e) => {

        e.preventDefault();

        let membershipSelection = null;

        if (showPlanPicker && selectedPlan && selectedOptionId) {

            const option = selectedPlan.options.find(
                (opt) => String(opt.id) === selectedOptionId
            );

            if (option) {

                membershipSelection = {
                    name: selectedPlan.name,
                    type: selectedPlan.type,
                    duration_days: selectedPlan.duration_days,
                    price: option.price
                };

            }

        }

        onSubmit({ ...formData, role }, membershipSelection);

    };

    return (

        <form
            className="register-member-form"
            onSubmit={handleSubmit}
        >

            {error && (
                <div className="dashboard-error">{error}</div>
            )}

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

                <label>Age</label>

                <input
                    type="number"
                    name="age"
                    min="1"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
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

            {showPlanPicker && (

                <div className="register-plan-section">

                    <label className="register-plan-label">
                        Membership Plan (optional)
                    </label>

                    <div className="form-field">

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
