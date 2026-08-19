import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { forgotPassword } from "../services/authService";

import AuthLayout from "../components/AuthLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setFieldError("");

        if (!email.trim()) {
            setFieldError("Please enter your email.");
            return;
        }

        if (!EMAIL_PATTERN.test(email.trim())) {
            setFieldError("Invalid email address.");
            return;
        }

        setLoading(true);

        try {

            const data = await forgotPassword(email.trim());

            setMessage(data.message);

        } catch (err) {

            console.error("FORGOT PASSWORD ERROR:", err);

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

            <h1>Forgot Password</h1>
            <p className="auth-subtitle">
                Enter the email associated with your account.
            </p>

            {message && (
                <div className="auth-success-banner">{message}</div>
            )}

            {error && (
                <div className="auth-error-banner">{error}</div>
            )}

            {!message && (

                <form onSubmit={handleSubmit} noValidate>

                    <div className={`auth-form-field ${fieldError ? "auth-field-invalid" : ""}`}>

                        <label htmlFor="forgot-email">Email</label>

                        <input
                            id="forgot-email"
                            type="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {fieldError && (
                            <p className="auth-field-error">{fieldError}</p>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

            )}

            <div className="auth-secondary-action">

                <button
                    type="button"
                    className="auth-back-link"
                    onClick={() => navigate("/login")}
                >
                    <ArrowLeft size={15} />
                    Back to Login
                </button>

            </div>

        </AuthLayout>
    );
}

export default ForgotPassword;
