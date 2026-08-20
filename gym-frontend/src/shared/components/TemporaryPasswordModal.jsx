import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

const ROLE_LABELS = {
    admin: "Admin",
    receptionist: "Receptionist",
    employee: "Employee",
    coach: "Coach",
    member: "Member"
};

const PAYMENT_TYPE_LABELS = {
    cash: "Cash",
    card: "Card",
    transfer: "Bank Transfer"
};

const formatDA = (value) =>
    `${Number(value).toLocaleString()} DA`;

const TemporaryPasswordModal = ({
    userName,
    email,
    role,
    temporaryPassword,
    membership,
    payment,
    onDone
}) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {

        navigator.clipboard.writeText(temporaryPassword);

        setCopied(true);

        setTimeout(() => setCopied(false), 2000);

    };

    // Registration, the membership and the initial payment are all
    // created together in one transaction on the backend - if we got
    // here, everything succeeded together, so paid/remaining always
    // reflect real, committed database rows.
    const paidAmount = payment ? payment.amount : 0;
    const remainingAmount = membership
        ? Number(membership.price) - paidAmount
        : 0;

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

                {membership && (

                    <div className="temp-password-membership">

                        <h3>Membership</h3>

                        <div className="temp-password-row">
                            <span>Plan</span>
                            <strong>{membership.name} — {membership.type}</strong>
                        </div>

                        <div className="temp-password-row">
                            <span>Start / End</span>
                            <strong>
                                {new Date(membership.start_date).toLocaleDateString()}
                                {" – "}
                                {new Date(membership.end_date).toLocaleDateString()}
                            </strong>
                        </div>

                        <div className="register-payment-summary">

                            <div>
                                <span>Total</span>
                                <strong>{formatDA(membership.price)}</strong>
                            </div>

                            <div>
                                <span>Paid</span>
                                <strong>{formatDA(paidAmount)}</strong>
                            </div>

                            <div className="register-payment-summary-remaining">
                                <span>Remaining</span>
                                <strong>{formatDA(remainingAmount)}</strong>
                            </div>

                        </div>

                        {payment && (

                            <div className="temp-password-row">
                                <span>Payment Method</span>
                                <strong>
                                    {PAYMENT_TYPE_LABELS[payment.type] || payment.type}
                                </strong>
                            </div>

                        )}

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
