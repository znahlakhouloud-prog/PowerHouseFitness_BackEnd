import { useState } from "react";

import { CreditCard, Landmark, Upload } from "lucide-react";

import { payWithCard, payWithTransfer } from "../services/paymentService";

const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.png,.pdf";

function PaymentModal({ membershipId, remaining, onClose, onSuccess }) {

    const [method, setMethod] = useState(null);
    const [amount, setAmount] = useState(remaining);
    const [receiptFile, setReceiptFile] = useState(null);

    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);


    const handleFileChange = (e) => {

        setReceiptFile(e.target.files[0] || null);

    };


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

        if (method === "transfer" && !receiptFile) {

            setErrors(["Please upload a receipt for the bank transfer"]);
            return;

        }

        setSubmitting(true);

        try {

            if (method === "card") {

                await payWithCard(membershipId, Number(amount));

            } else {

                await payWithTransfer(membershipId, Number(amount), receiptFile);

            }

            onSuccess(method);

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

                {!method ? (

                    <div className="payment-method-grid">

                        <button
                            type="button"
                            className="payment-method-option"
                            onClick={() => setMethod("card")}
                        >
                            <CreditCard size={22} />
                            <span>Card</span>
                        </button>

                        <button
                            type="button"
                            className="payment-method-option"
                            onClick={() => setMethod("transfer")}
                        >
                            <Landmark size={22} />
                            <span>Bank Transfer</span>
                        </button>

                    </div>

                ) : (

                    <form onSubmit={handleSubmit}>

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

                        {method === "card" ? (

                            <p className="form-hint">
                                This is a simulated card payment for demo purposes.
                                No card details are collected or stored.
                            </p>

                        ) : (

                            <div className="form-field">

                                <label>Receipt</label>

                                <label className="receipt-upload">

                                    <Upload size={18} />
                                    <div>
                                        {receiptFile
                                            ? receiptFile.name
                                            : "Click to upload your transfer receipt"
                                        }
                                    </div>

                                    <input
                                        type="file"
                                        accept={ACCEPTED_FILE_TYPES}
                                        onChange={handleFileChange}
                                    />

                                </label>

                                <p className="form-hint">
                                    Your payment will be marked as pending until
                                    the transfer is reviewed.
                                </p>

                            </div>

                        )}

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setMethod(null)}
                                disabled={submitting}
                            >
                                Back
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

                )}

                {!method && (

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}

export default PaymentModal;
