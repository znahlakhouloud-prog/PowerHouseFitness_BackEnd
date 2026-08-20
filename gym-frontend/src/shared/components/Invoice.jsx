import { Dumbbell } from "lucide-react";

import { formatDateOnly } from "../utils/dateUtils";

const PAYMENT_TYPE_LABELS = {
    cash: "Cash",
    card: "Card",
    transfer: "Bank Transfer"
};

const formatDA = (value) =>
    `${Number(value).toLocaleString()} DA`;

/*
 * Pure presentational printable invoice. Only ever renders the safe
 * fields the backend already filtered down to - full card number,
 * CVV and PIN are never part of `data` in the first place, so there
 * is nothing here that could accidentally print them.
 */
function Invoice({ data }) {

    const { invoiceNumber, payment, membership, member } = data;

    return (

        <div className="invoice-printable">

            <div className="invoice-header">

                <div className="invoice-logo">

                    <span className="invoice-logo-icon">
                        <Dumbbell size={22} />
                    </span>

                    <div>
                        <div className="invoice-brand-name">
                            PowerHouse Fitness
                        </div>
                        <div className="invoice-brand-contact">
                            contact@powerhousefitness.com
                        </div>
                    </div>

                </div>

                <div className="invoice-title">
                    FACTURE / INVOICE
                </div>

            </div>

            <div className="invoice-meta">

                <div>
                    <span>Invoice N°</span>
                    <strong>{invoiceNumber}</strong>
                </div>

                <div>
                    <span>Date</span>
                    <strong>{formatDateOnly(payment.p_date)}</strong>
                </div>

                <div>
                    <span>Time</span>
                    <strong>
                        {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </strong>
                </div>

            </div>

            <div className="invoice-section">

                <h3>Member</h3>

                <div className="invoice-row">
                    <span>Name</span>
                    <strong>{member.user_name}</strong>
                </div>

               
                <div className="invoice-row">
                    <span>Email</span>
                    <strong>{member.email}</strong>
                </div>

            </div>

            <div className="invoice-section">

                <h3>Membership</h3>

                <div className="invoice-row">
                    <span>Plan</span>
                    <strong>{membership.name} — {membership.type}</strong>
                </div>

                <div className="invoice-row">
                    <span>Duration</span>
                    <strong>{membership.duration} days</strong>
                </div>

                <div className="invoice-row">
                    <span>Start</span>
                    <strong>{formatDateOnly(membership.start_date)}</strong>
                </div>

                <div className="invoice-row">
                    <span>End</span>
                    <strong>{formatDateOnly(membership.end_date)}</strong>
                </div>

            </div>

            <div className="invoice-divider" />

            <div className="invoice-amounts">

                <div>
                    <span>Membership Price</span>
                    <strong>{formatDA(membership.price)}</strong>
                </div>

                <div>
                    <span>Amount Paid (this payment)</span>
                    <strong>{formatDA(payment.amount)}</strong>
                </div>

                <div className="invoice-amounts-remaining">
                    <span>Remaining</span>
                    <strong>{formatDA(payment.rest)}</strong>
                </div>

            </div>

            <div className="invoice-divider" />

            <div className="invoice-section">

                <h3>Payment</h3>

                <div className="invoice-row">
                    <span>Method</span>
                    <strong>
                        {PAYMENT_TYPE_LABELS[payment.type] || payment.type}
                    </strong>
                </div>

                {payment.type === "card" && (

                    <>

                        <div className="invoice-row">
                            <span>Card Brand</span>
                            <strong>{payment.card_brand}</strong>
                        </div>

                        <div className="invoice-row">
                            <span>Transaction Reference</span>
                            <strong>{payment.transaction_reference}</strong>
                        </div>

                    </>

                )}

                {payment.type === "transfer" && (

                    <div className="invoice-row">
                        <span>Status</span>
                        <strong>{payment.status}</strong>
                    </div>

                )}

            </div>

            <div className="invoice-footer">
                <p>Thank you for choosing</p>
                <p className="invoice-footer-brand">PowerHouse Fitness</p>
            </div>

        </div>

    );

}

export default Invoice;
