import { useEffect, useState } from "react";

import { getPublicPlans } from "../services/planService";

import Reveal from "./Reveal";

const formatDuration = (durationDays) => {

    if (!durationDays) {
        return null;
    }

    if (durationDays % 30 === 0) {

        const months = durationDays / 30;

        return months === 1 ? "1 Month" : `${months} Months`;

    }

    return `${durationDays} days`;

};

function MembershipPlans() {

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {

        const load = async () => {

            try {

                const data = await getPublicPlans();
                setPlans(data);

            } catch (err) {

                console.error("LOAD PUBLIC PLANS ERROR:", err);
                setError(true);

            } finally {

                setLoading(false);

            }

        };

        load();

    }, []);


    const handleAsk = () => {

        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

    };


    return (

        <section id="membership" className="lp-section">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">Membership</span>
                    <h2>Choose Your Plan</h2>
                    <p>
                        Flexible membership durations to match your training
                        goals. Pricing shown reflects our current plans.
                    </p>
                </div>

                {loading && (
                    <div className="lp-plans-empty">
                        Loading membership plans...
                    </div>
                )}

                {!loading && error && (
                    <div className="lp-plans-error">
                        We couldn't load membership pricing right now.
                        Please contact us for current plans and pricing.
                    </div>
                )}

                {!loading && !error && plans.length === 0 && (
                    <div className="lp-plans-empty">
                        Membership plans are being updated. Contact us for
                        current pricing.
                    </div>
                )}

                {!loading && !error && plans.length > 0 && (

                    <div className="lp-plans-grid">

                        {plans.map((plan, index) => (

                            <Reveal key={plan.id}>

                                <div
                                    className={
                                        index === 1
                                            ? "lp-plan-card lp-plan-featured"
                                            : "lp-plan-card"
                                    }
                                >

                                    {index === 1 && (
                                        <span className="lp-plan-badge">
                                            Popular
                                        </span>
                                    )}

                                    <h3>{plan.name}</h3>

                                    <div className="lp-plan-type">
                                        {formatDuration(plan.duration_days) || plan.type}
                                    </div>

                                    <div className="lp-plan-options">

                                        {plan.options.map((option) => (

                                            <div
                                                key={option.id}
                                                className="lp-plan-option"
                                            >

                                                <span className="lp-plan-option-sessions">
                                                    {option.nbr_sessions} sessions included
                                                </span>

                                                <span className="lp-plan-option-price">
                                                    {Number(option.price).toLocaleString()}
                                                    <span>DA</span>
                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                    <button
                                        className="lp-btn lp-btn-dark"
                                        onClick={handleAsk}
                                        style={{ width: "100%" }}
                                    >
                                        Ask About This Plan
                                    </button>

                                </div>

                            </Reveal>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}

export default MembershipPlans;
