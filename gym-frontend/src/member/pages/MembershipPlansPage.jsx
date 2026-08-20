import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../auth/context/authContext";

import { getPlans } from "../services/planService";
import {
    getMyMembership,
    getMyBalance,
    subscribeToPlan
} from "../services/membershipService";

import "../style/member.css";

const todayISO = () =>
    new Date().toISOString().split("T")[0];

function MembershipPlansPage() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [hasActiveMembership, setHasActiveMembership] = useState(false);
    const [previousUnpaidBalance, setPreviousUnpaidBalance] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selected, setSelected] = useState({ planId: null, optionId: null });
    const [subscribing, setSubscribing] = useState(false);


    useEffect(() => {

        const load = async () => {

            try {

                const plansData = await getPlans();
                setPlans(plansData);

                try {

                    await getMyMembership(user.id);
                    setHasActiveMembership(true);

                } catch {

                    setHasActiveMembership(false);

                }

                const balanceData = await getMyBalance(user.id);
                setPreviousUnpaidBalance(balanceData.previousUnpaidBalance);

            } catch (err) {

                console.error("LOAD PLANS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load membership plans"
                );

            } finally {

                setLoading(false);

            }

        };

        load();

    }, [user.id]);


    const selectionBlocked = hasActiveMembership || previousUnpaidBalance > 0;

    const handleSelectOption = (plan, option) => {

        setSelected({ planId: plan.id, optionId: option.id });

    };


    const handleChoosePlan = async (plan, option) => {

        setError("");
        setSubscribing(true);

        try {

            await subscribeToPlan({
                id_user: user.id,
                id_plan: option.id,
                start_date: todayISO(),
                duration_promo: 0
            });

            navigate("/member/payments");

        } catch (err) {

            console.error("SUBSCRIBE ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to subscribe to this plan"
            );

        } finally {

            setSubscribing(false);

        }

    };


    if (loading) {

        return (
            <div className="member-loading">
                Loading membership plans...
            </div>
        );

    }


    return (

        <div className="plans-page">

            <div className="page-header">

                <div>
                    <h1>Membership Plans</h1>
                    <p>Browse available plans and choose the one that fits you</p>
                </div>

            </div>

            {error && (
                <div className="dashboard-error">{error}</div>
            )}

            {hasActiveMembership && (
                <div className="dashboard-success">
                    You already have an active membership. Choosing a new
                    plan is only available once your current one expires.
                </div>
            )}

            {!hasActiveMembership && previousUnpaidBalance > 0 && (
                <div className="dashboard-error">
                    You have an unpaid balance of{" "}
                    {previousUnpaidBalance.toLocaleString()} DA from a
                    previous membership. Please settle it with the front
                    desk before starting a new season.
                </div>
            )}

            {plans.length === 0 ? (

                <div className="member-empty">
                    No membership plans are available right now.
                </div>

            ) : (

                <div className="member-plans-grid">

                    {plans.map((plan) => (

                        <div key={plan.id} className="member-plan-card">

                            <h3>{plan.name}</h3>

                            <div className="member-plan-card-type">
                                {plan.type} — {plan.duration_days} days
                            </div>

                            <div className="plan-options">

                                {plan.options.map((option) => (

                                    <div
                                        key={option.id}
                                        className={
                                            selected.optionId === option.id
                                                ? "plan-option selected"
                                                : "plan-option"
                                        }
                                        onClick={() =>
                                            !selectionBlocked &&
                                            handleSelectOption(plan, option)
                                        }
                                    >

                                        <span className="plan-option-sessions">
                                            {option.nbr_sessions} sessions
                                        </span>

                                        <span className="plan-option-price">
                                            {Number(option.price).toLocaleString()} DA
                                        </span>

                                    </div>

                                ))}

                            </div>

                            <div className="member-plan-card-footer">

                                <button
                                    className="btn-primary"
                                    disabled={
                                        selectionBlocked ||
                                        subscribing ||
                                        selected.planId !== plan.id
                                    }
                                    onClick={() => {

                                        const option = plan.options.find(
                                            (opt) => opt.id === selected.optionId
                                        );

                                        if (option) {
                                            handleChoosePlan(plan, option);
                                        }

                                    }}
                                    style={{ width: "100%" }}
                                >
                                    {subscribing && selected.planId === plan.id
                                        ? "Subscribing..."
                                        : "Choose Plan"
                                    }
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default MembershipPlansPage;
