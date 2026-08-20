import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../auth/context/authContext";

import { calculateAge, formatDateOnly } from "../../shared/utils/dateUtils";

import "../style/receptionist.css";
import "../style/memberDetails.css";

function ProfilePage() {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    return (

        <div className="profile-page">

            <div className="page-header">

                <div>
                    <h1>Profile</h1>
                    <p>Your account information</p>
                </div>

            </div>

            <div className="dashboard-card member-info-card">

                <div className="card-header">
                    <h2>Account Details</h2>
                </div>

                <div className="member-info-grid">

                    <div className="member-info-item">
                        <span>Full Name</span>
                        <strong>{user?.user_name}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Email</span>
                        <strong>{user?.email}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Birth Date</span>
                        <strong>{formatDateOnly(user?.birth_date)}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Age</span>
                        <strong>{calculateAge(user?.birth_date)}</strong>
                    </div>

                    <div className="member-info-item">
                        <span>Role</span>
                        <strong>{user?.role}</strong>
                    </div>

                </div>

                <button
                    className="btn-primary profile-change-password"
                    onClick={() =>
                        navigate("/change-password")
                    }
                >
                    Change Password
                </button>

            </div>

        </div>

    );
}

export default ProfilePage;
