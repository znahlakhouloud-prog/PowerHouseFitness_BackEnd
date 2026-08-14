import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../services/authService";

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

        } catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Reset Password</h1>

            {message && (
                <div>

                    <p>{message}</p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>

                </div>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!message && (
                <form onSubmit={handleSubmit}>

                    <div>

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"
                        }
                    </button>

                </form>
            )}

            {!message && (
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>
            )}

        </div>
    );
}

export default ResetPassword;