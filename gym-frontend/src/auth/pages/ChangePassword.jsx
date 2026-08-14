import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";

import { changePassword } from "../services/authService";

function ChangePassword() {

    const navigate = useNavigate();

    const {
        user,
        token,
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
                newPassword,
                token
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


        } catch (error) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Password change failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div>

            <h1>Change Password</h1>


            {error && (
                <p>{error}</p>
            )}


            {success && (
                <p>{success}</p>
            )}


            <form onSubmit={handleSubmit}>


                {/* OLD PASSWORD */}

                <div>

                    <label>
                        Old Password
                    </label>

                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) =>
                            setOldPassword(e.target.value)
                        }
                        required
                    />

                </div>


                {/* NEW PASSWORD */}

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


                {/* CONFIRM PASSWORD */}

                <div>

                    <label>
                        Confirm New Password
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


                {/* SUBMIT */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Changing password..."
                        : "Change Password"
                    }

                </button>


            </form>

        </div>
    );
}

export default ChangePassword;