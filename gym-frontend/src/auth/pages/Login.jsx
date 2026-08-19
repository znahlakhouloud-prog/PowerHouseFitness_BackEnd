import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext.js";
import { loginUser } from "../services/authService";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const validate = () => {

        const errors = {};

        if (!email.trim()) {
            errors.email = "Please enter your email.";
        } else if (!EMAIL_PATTERN.test(email.trim())) {
            errors.email = "Invalid email address.";
        }

        if (!password) {
            errors.password = "Please enter your password.";
        }

        return errors;

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const errors = validate();

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);

        try {

            const data = await loginUser(email.trim(), password);

            login(data.user, data.token);

            if (data.user.must_change_password === 1) {

                navigate("/change-password");
                return;

            }

            switch (data.user.role) {

                case "admin":
                    navigate("/admin");
                    break;

                case "employee":
                    navigate("/employee");
                    break;

                case "coach":
                    navigate("/coach");
                    break;

                case "member":
                    navigate("/member");
                    break;

                case "receptionist":
                    navigate("/receptionist");
                    break;

                default:
                    setError("Unknown user role");

            }

        } catch (err) {

            console.error("LOGIN ERROR:", err);

            if (err.response?.data?.message) {

                setError(err.response.data.message);

            } else {

                setError("Server error. Please try again.");

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <AuthLayout>

            <h1>Welcome Back</h1>
            <p className="auth-subtitle">
                Log in to your PowerHouse Fitness account.
            </p>

            {error && (
                <div className="auth-error-banner">{error}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                <div className={`auth-form-field ${fieldErrors.email ? "auth-field-invalid" : ""}`}>

                    <label htmlFor="login-email">Email</label>

                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {fieldErrors.email && (
                        <p className="auth-field-error">{fieldErrors.email}</p>
                    )}

                </div>

                <div className={`auth-form-field ${fieldErrors.password ? "auth-field-invalid" : ""}`}>

                    <label htmlFor="login-password">Password</label>

                    <PasswordInput
                        id="login-password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {fieldErrors.password && (
                        <p className="auth-field-error">{fieldErrors.password}</p>
                    )}

                </div>

                <div className="auth-row-between">

                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot password?
                    </button>

                </div>

                <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </AuthLayout>

    );
}

export default Login;
