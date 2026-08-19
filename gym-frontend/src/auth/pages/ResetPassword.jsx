import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../services/authService";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

function ResetPassword() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        // Check token
        if (!token) {

            setError("Invalid or missing reset token.");

            return;
        }

        // Check passwords
        if (newPassword !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }

        // Check password length
        if (newPassword.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        setLoading(true);

        try {

            const data = await resetPassword(
                token,
                newPassword
            );

            setMessage(data.message);

            // Clear inputs
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {

            console.error("RESET PASSWORD ERROR:", err);

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

            <h1>Reset Password</h1>

            {!message && (
                <p className="auth-subtitle">
                    Choose a new password for your account.
                </p>
            )}

            {message && (

                <>

                    <div className="auth-success-banner">{message}</div>

                    <button
                        type="button"
                        className="auth-submit-btn"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>

                </>

            )}

            {error && (
                <div className="auth-error-banner">{error}</div>
            )}

            {!message && (

                <form onSubmit={handleSubmit} noValidate>

                    <div className="auth-form-field">

                        <label htmlFor="reset-new-password">New Password</label>

                        <PasswordInput
                            id="reset-new-password"
                            value={newPassword}
                            autoComplete="new-password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                    </div>

                    <div className="auth-form-field">

                        <label htmlFor="reset-confirm-password">Confirm Password</label>

                        <PasswordInput
                            id="reset-confirm-password"
                            value={confirmPassword}
                            autoComplete="new-password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>

            )}

            {!message && (

                <div className="auth-secondary-action">

                    <button
                        type="button"
                        className="auth-back-link"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>

                </div>

            )}

        </AuthLayout>
    );
}

export default ResetPassword;
