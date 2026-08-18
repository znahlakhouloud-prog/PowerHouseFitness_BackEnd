import { useState } from "react";

const RegisterMemberForm = ({
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

    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

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

        if (selectedPlan && selectedOptionId) {

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

        onSubmit(formData, membershipSelection);

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
                    placeholder="member@example.com"
                    required
                />

            </div>


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


            <button
                type="submit"
                className="btn-primary"
                disabled={loading}
            >
                {loading ? "Registering..." : "Register Member"}
            </button>

        </form>

    );

};

export default RegisterMemberForm;
