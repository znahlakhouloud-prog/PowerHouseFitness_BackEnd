import { useEffect, useState } from "react";
import { Printer, X } from "lucide-react";

import { getInvoice } from "../services/invoiceService";

import Invoice from "./Invoice";

import "../style/invoice.css";

function InvoiceModal({ paymentId, onClose }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let cancelled = false;

        const load = async () => {

            try {

                setLoading(true);
                setError("");

                const invoiceData = await getInvoice(paymentId);

                if (!cancelled) {
                    setData(invoiceData);
                }

            } catch (err) {

                console.error("LOAD INVOICE ERROR:", err);

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        "Failed to load invoice"
                    );

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        load();

        return () => {
            cancelled = true;
        };

    }, [paymentId]);

    const handlePrint = () => {
        window.print();
    };

    return (

        <div
            className="modal-overlay invoice-modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-content invoice-modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="invoice-modal-actions no-print">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                    >
                        <X size={16} />
                        Close
                    </button>

                    {data && (

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handlePrint}
                        >
                            <Printer size={16} />
                            Print Invoice
                        </button>

                    )}

                </div>

                {loading && (
                    <div className="invoice-modal-state no-print">
                        Loading invoice...
                    </div>
                )}

                {!loading && error && (
                    <div className="invoice-modal-state invoice-modal-error no-print">
                        {error}
                    </div>
                )}

                {!loading && data && (
                    <Invoice data={data} />
                )}

            </div>

        </div>

    );

}

export default InvoiceModal;
