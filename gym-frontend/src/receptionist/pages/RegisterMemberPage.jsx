import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { registerUser } from "../../auth/services/authService";
import { getPlans } from "../services/planService";
import { createMembership } from "../services/membershipService";

import RegisterMemberForm from "../components/RegisterMemberForm";
import TemporaryPasswordModal from "../components/TemporaryPasswordModal";

import "../style/receptionist.css";
import "../style/registerMember.css";

const todayISO = () =>
    new Date().toISOString().split("T")[0];

function RegisterMemberPage() {

    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [registeredMember, setRegisteredMember] = useState(null);


    useEffect(() => {

        const loadPlans = async () => {

            try {

                const data = await getPlans();

                setPlans(data);

            } catch (err) {

                console.error("LOAD PLANS ERROR:", err);

                // Non-fatal - registration still works without the
                // picker, it just won't have options to choose from.

            }

        };

        loadPlans();

    }, []);


    const handleSubmit = async (formData, membershipSelection) => {

        setError("");
        setLoading(true);

        try {

            const data = await registerUser({
                ...formData,
                role: "member"
            });

            let membershipWarning = "";

            if (membershipSelection) {

                try {

                    await createMembership({
                        id_user: data.id,
                        name: membershipSelection.name,
                        type: membershipSelection.type,
                        price: membershipSelection.price,
                        duration: membershipSelection.duration_days,
                        start_date: todayISO(),
                        duration_promo: 0
                    });

                } catch (membershipErr) {

                    console.error(
                        "ASSIGN MEMBERSHIP ERROR:",
                        membershipErr
                    );

                    membershipWarning =
                        membershipErr.response?.data?.message ||
                        "Could not assign the membership.";

                }

            }

            setRegisteredMember({
                memberName: formData.user_name,
                email: formData.email,
                temporaryPassword: data.temporaryPassword,
                membershipWarning
            });

        } catch (err) {

            console.error("REGISTER MEMBER ERROR:", err);

            if (err.response?.data?.errors) {

                setError(
                    err.response.data.errors
                        .map((e) => e.msg)
                        .join(", ")
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to register member"
                );

            }

        } finally {

            setLoading(false);

        }

    };


    const handleDone = () => {

        navigate("/receptionist/members");

    };


    return (

        <div className="register-member-page">

            <div className="page-header">

                <div>
                    <h1>Register Member</h1>
                    <p>Create a new member account</p>
                </div>

            </div>

            <div className="dashboard-card register-member-card">

                <RegisterMemberForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    plans={plans}
                />

            </div>

            {registeredMember && (

                <TemporaryPasswordModal
                    memberName={registeredMember.memberName}
                    email={registeredMember.email}
                    temporaryPassword={registeredMember.temporaryPassword}
                    membershipWarning={registeredMember.membershipWarning}
                    onDone={handleDone}
                />

            )}

        </div>

    );
}

export default RegisterMemberPage;
