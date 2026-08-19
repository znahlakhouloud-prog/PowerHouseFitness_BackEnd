import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { registerUser } from "../../auth/services/authService";
import { getPlans } from "../services/planService";
import { createMembership } from "../services/membershipService";

import RegisterUserForm from "../../shared/components/RegisterUserForm";
import TemporaryPasswordModal from "../../shared/components/TemporaryPasswordModal";

import "../style/registerUser.css";

const ADMIN_ROLE_OPTIONS = [
    "receptionist",
    "employee",
    "coach",
    "member"
];

const todayISO = () =>
    new Date().toISOString().split("T")[0];

function RegisterUserPage() {

    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [registeredUser, setRegisteredUser] = useState(null);


    useEffect(() => {

        const loadPlans = async () => {

            try {

                const data = await getPlans();

                setPlans(data);

            } catch (err) {

                console.error("LOAD PLANS ERROR:", err);

                // Non-fatal - only the "member" role ever needs the
                // plan picker, and registration still works without it.

            }

        };

        loadPlans();

    }, []);


    const handleSubmit = async (formData, membershipSelection) => {

        setError("");
        setLoading(true);

        try {

            const data = await registerUser(formData);

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

            setRegisteredUser({
                userName: formData.user_name,
                email: formData.email,
                role: formData.role,
                temporaryPassword: data.temporaryPassword,
                membershipWarning
            });

        } catch (err) {

            console.error("REGISTER USER ERROR:", err);

            if (err.response?.data?.errors) {

                setError(
                    err.response.data.errors
                        .map((e) => e.msg)
                        .join(", ")
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to register user"
                );

            }

        } finally {

            setLoading(false);

        }

    };


    const handleDone = () => {

        navigate("/admin/users");

    };


    return (

        <div className="register-user-page">

            <div className="page-header">

                <div>
                    <h1>Register User</h1>
                    <p>Create a Receptionist, Employee, Coach or Member account</p>
                </div>

            </div>

            <div className="dashboard-card register-member-card">

                <RegisterUserForm
                    roleOptions={ADMIN_ROLE_OPTIONS}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    plans={plans}
                />

            </div>

            {registeredUser && (

                <TemporaryPasswordModal
                    userName={registeredUser.userName}
                    email={registeredUser.email}
                    role={registeredUser.role}
                    temporaryPassword={registeredUser.temporaryPassword}
                    membershipWarning={registeredUser.membershipWarning}
                    onDone={handleDone}
                />

            )}

        </div>

    );
}

export default RegisterUserPage;
