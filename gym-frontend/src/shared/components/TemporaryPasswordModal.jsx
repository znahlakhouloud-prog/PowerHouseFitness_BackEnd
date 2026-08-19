import { useState } from "react";
import { CheckCircle2, Copy, Check, AlertTriangle } from "lucide-react";

const ROLE_LABELS = {
    admin: "Admin",
    receptionist: "Receptionist",
    employee: "Employee",
    coach: "Coach",
    member: "Member"
};

const TemporaryPasswordModal = ({
    userName,
    email,
    role,
    temporaryPassword,
    membershipWarning,
    onDone
}) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {

        navigator.clipboard.writeText(temporaryPassword);

        setCopied(true);

        setTimeout(() => setCopied(false), 2000);

    };

    return (

        <div className="modal-overlay">

            <div className="modal-content temp-password-modal">

                <div className="temp-password-icon">
                    <CheckCircle2 size={40} />
                </div>

                <h2>User Registered Successfully</h2>

                <p className="temp-password-subtitle">
                    Give this temporary password to the user securely.
                    They'll be asked to change it on first login.
                </p>

                <div className="temp-password-details">

                    <div className="temp-password-row">
                        <span>Name</span>
                        <strong>{userName}</strong>
                    </div>

                    <div className="temp-password-row">
                        <span>Email</span>
                        <strong>{email}</strong>
                    </div>

                    {role && (

                        <div className="temp-password-row">
                            <span>Role</span>
                            <strong>{ROLE_LABELS[role] || role}</strong>
                        </div>

                    )}

                </div>

                <div className="temp-password-box">

                    <span className="temp-password-value">
                        {temporaryPassword}
                    </span>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                Copy Password
                            </>
                        )}
                    </button>

                </div>

                {membershipWarning && (

                    <div className="temp-password-membership-warning">
                        <AlertTriangle size={16} />
                        <span>
                            Account created, but the membership
                            couldn't be assigned: {membershipWarning}{" "}
                            You can add it from the user's page later.
                        </span>
                    </div>

                )}

                <button
                    type="button"
                    className="btn-primary temp-password-done"
                    onClick={onDone}
                >
                    Done
                </button>

            </div>

        </div>

    );

};

export default TemporaryPasswordModal;
