import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { registerUser } from "../../auth/services/authService";
import { getPlans } from "../services/planService";

import RegisterUserForm from "../../shared/components/RegisterUserForm";
import TemporaryPasswordModal from "../../shared/components/TemporaryPasswordModal";

import "../style/registerUser.css";

const ADMIN_ROLE_OPTIONS = [
    "receptionist",
    "employee",
    "coach",
    "member"
];

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


    // Registration, the membership and the initial payment are all
    // created together in one atomic request - the backend runs them
    // in a single database transaction (see registerService), so
    // there's no separate "assign membership" call to fail after the
    // account already exists.
    const handleSubmit = async (payload) => {

        setError("");
        setLoading(true);

        try {

            const data = await registerUser(payload);

            setRegisteredUser({
                userName: payload.user_name,
                email: payload.email,
                role: payload.role,
                temporaryPassword: data.temporaryPassword,
                membership: data.membership,
                payment: data.payment
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
                    membership={registeredUser.membership}
                    payment={registeredUser.payment}
                    onDone={handleDone}
                />

            )}

        </div>

    );
}

export default RegisterUserPage;
