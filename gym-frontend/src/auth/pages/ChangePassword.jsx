import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";

import { changePassword } from "../services/authService";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

function ChangePassword() {

    const navigate = useNavigate();

    const {
        user,
        updateUser
    } = useContext(AuthContext);


    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Check new passwords
        if (newPassword !== confirmPassword) {

            setError(
                "New passwords do not match"
            );

            return;
        }


        // Check password length
        if (newPassword.length < 6) {

            setError(
                "New password must contain at least 6 characters"
            );

            return;
        }


        // Prevent same password
        if (oldPassword === newPassword) {

            setError(
                "New password must be different from the old password"
            );

            return;
        }


        try {

            setLoading(true);


            // Change password in backend
            const data = await changePassword(
                oldPassword,
                newPassword
            );

            console.log(
                "CHANGE PASSWORD RESPONSE:",
                data
            );


            /*
             * Backend changed:
             *
             * must_change_password = 1
             *
             * to:
             *
             * must_change_password = 0
             *
             * We must update the React state too.
             */

            updateUser({
                must_change_password: 0
            });


            setSuccess(
                "Password changed successfully"
            );


            /*
             * Redirect according to user's role.
             */

            switch (user.role) {

                case "admin":
                    navigate("/admin", {
                        replace: true
                    });
                    break;

                case "employee":
                    navigate("/employee", {
                        replace: true
                    });
                    break;

                case "receptionist":
                    navigate("/receptionist", {
                        replace: true
                    });
                    break;

                case "coach":
                    navigate("/coach", {
                        replace: true
                    });
                    break;

                case "member":
                    navigate("/member", {
                        replace: true
                    });
                    break;

                default:
                    setError(
                        "Unknown user role"
                    );
            }


        } catch (err) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                err
            );

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

            <h1>Change Password</h1>
            <p className="auth-subtitle">
                For your security, please set a new password before continuing.
            </p>

            {error && (
                <div className="auth-error-banner">{error}</div>
            )}

            {success && (
                <div className="auth-success-banner">{success}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                <div className="auth-form-field">

                    <label htmlFor="change-old-password">Old Password</label>

                    <PasswordInput
                        id="change-old-password"
                        value={oldPassword}
                        autoComplete="current-password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                </div>

                <div className="auth-form-field">

                    <label htmlFor="change-new-password">New Password</label>

                    <PasswordInput
                        id="change-new-password"
                        value={newPassword}
                        autoComplete="new-password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                </div>

                <div className="auth-form-field">

                    <label htmlFor="change-confirm-password">Confirm New Password</label>

                    <PasswordInput
                        id="change-confirm-password"
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
                    {loading ? "Changing password..." : "Change Password"}
                </button>

            </form>

        </AuthLayout>
    );
}

export default ChangePassword;
