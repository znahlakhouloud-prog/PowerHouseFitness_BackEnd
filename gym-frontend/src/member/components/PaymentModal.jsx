import { useState } from "react";

import { Wallet } from "lucide-react";

import { payCash } from "../services/paymentService";

function PaymentModal({ membershipId, remaining, onClose, onSuccess }) {

    const [amount, setAmount] = useState(remaining);

    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors([]);

        if (!amount || Number(amount) <= 0) {

            setErrors(["Enter a valid amount"]);
            return;

        }

        if (Number(amount) > remaining) {

            setErrors([`Amount cannot exceed the remaining balance (${remaining} DA)`]);
            return;

        }

        setSubmitting(true);

        try {

            await payCash(membershipId, Number(amount));

            onSuccess();

        } catch (error) {

            console.error("PAYMENT ERROR:", error);

            if (error.response?.data?.errors) {

                setErrors(
                    error.response.data.errors.map((err) => err.msg)
                );

            } else {

                setErrors([
                    error.response?.data?.message ||
                    "Payment failed"
                ]);

            }

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="modal-overlay" onClick={onClose}>

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <h2>Make a Payment</h2>

                {errors.length > 0 && (

                    <div className="modal-errors">
                        {errors.map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="payment-method-fixed-banner">
                        <Wallet size={20} />
                        <span>Payment Method: Cash</span>
                    </div>

                    <div className="form-field">

                        <label>Amount (DA)</label>

                        <input
                            type="number"
                            min="1"
                            max={remaining}
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />

                        <p className="form-hint">
                            Remaining balance: {remaining.toLocaleString()} DA
                        </p>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Processing..." : "Confirm Payment"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default PaymentModal;
