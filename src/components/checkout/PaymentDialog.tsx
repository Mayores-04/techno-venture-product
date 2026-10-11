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

    window.setTimeout(() => {
      setProcessing(false);

      if (!success) {
        setError(
          "Demo payment declined. No payment was processed. The cart remains available for retry.",
        );
        return;
      }

      onSuccess();
    }, 1200);
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
            <h2 id="payment-title">DEMO PAYMENT</h2>
            <p>Use the physical card terminal shown in the prototype.</p>
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
            <h3>Payment terminal ready</h3>
            <p>
              A real payment provider would be connected here. This prototype only simulates a payment result and never stores or reads card details.
            </p>
          </div>
        </div>

        {processing && (
          <div className="payment-status" role="status" aria-live="polite">
            Payment pending on the terminal...
          </div>
        )}

        {error && (
          <p role="alert" className="payment-error">
            {error}
          </p>
        )}

        <div className="demo-payment-actions">
          <p className="demo-warning">DEMO MODE — no real card payment is processed.</p>

          <button
            type="button"
            className="primary-button"
            disabled={processing}
            onClick={() => simulatePayment(true)}
          >
            {processing ? "Processing..." : "Simulate successful payment"}
          </button>

          <button
            type="button"
            className="secondary-button"
            disabled={processing}
            onClick={() => simulatePayment(false)}
          >
            Simulate failed payment
          </button>
        </div>
      </section>
    </div>
  );
}
