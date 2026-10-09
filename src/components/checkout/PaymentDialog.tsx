"use client";

import { useState } from "react";
import { CreditCard, LockKeyhole, X } from "lucide-react";
import { formatMoney } from "@/src/lib/products";

type Props = {
  total: number;
  onSuccess: () => void;
  onClose: () => void;
};

export default function PaymentDialog({ total, onSuccess, onClose }: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function simulatePayment(success: boolean) {
    if (processing) return;

    setProcessing(true);
    setError("");

    // Demo only. This does not contact a payment provider.
    window.setTimeout(() => {
      setProcessing(false);

      if (!success) {
        setError(
          "Demo payment declined. No payment was processed. Please try again.",
        );
        return;
      }

      onSuccess();
    }, 1000);
  }

  return (
    <div className="modal-backdrop">
      <section
        className="payment-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
      >
        <div className="dialog-heading">
          <div>
            <h2 id="payment-title">Card Payment</h2>
            <p>Complete your checkout.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Close payment dialog"
            disabled={processing}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <div className="payment-amount">
          <div className="payment-icon">
            <CreditCard size={32} />
          </div>

          <p>Total amount due</p>
          <strong>{formatMoney(total)}</strong>
        </div>

        <div className="terminal-instructions">
          <LockKeyhole size={23} />

          <div>
            <h3>Present your card</h3>
            <p>
              In a real store, follow the instructions on the connected payment
              terminal. Enter your PIN there only if requested.
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="payment-error">
            {error}
          </p>
        )}

        <div className="demo-payment-actions">
          <p className="demo-warning">
            DEMO MODE — no real card payment is possible.
          </p>

          <button
            type="button"
            className="primary-button"
            disabled={processing}
            onClick={() => simulatePayment(true)}
          >
            {processing ? "Processing..." : "Simulate Successful Payment"}
          </button>

          <button
            type="button"
            className="secondary-button"
            disabled={processing}
            onClick={() => simulatePayment(false)}
          >
            Simulate Failed Payment
          </button>
        </div>
      </section>
    </div>
  );
}
