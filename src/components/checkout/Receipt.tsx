"use client";

import { CheckCircle2, Printer, RotateCcw } from "lucide-react";

import type { CartItem } from "@/src/lib/products";
import { formatMoney } from "@/src/lib/products";

export type ReceiptData = {
  number: string;
  date: string;
  items: CartItem[];
  total: number;
};

type Props = {
  receipt: ReceiptData;
  onNewSession: () => void;
};

export default function Receipt({ receipt, onNewSession }: Props) {
  function printReceipt() {
    window.print();
  }

  return (
    <div className="modal-backdrop receipt-backdrop">
      <section
        className="receipt-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
      >
        <div className="receipt-success">
          <CheckCircle2 size={48} />

          <h2 id="receipt-title">Payment Successful</h2>

          <p>Your demo transaction is complete.</p>
        </div>

        <div className="print-receipt">
          <div className="receipt-store">
            <h2>MINI MART</h2>
            <p>SELF-SERVICE CHECKOUT</p>
            <p>DEMO RECEIPT</p>
          </div>

          <div className="receipt-meta">
            <p>
              <span>Receipt No.</span>
              <span>{receipt.number}</span>
            </p>

            <p>
              <span>Date</span>
              <span>{receipt.date}</span>
            </p>
          </div>

          <div className="receipt-table">
            <div className="receipt-row receipt-table-heading">
              <span>Item</span>
              <span>Amount</span>
            </div>

            {receipt.items.map((item) => (
              <div key={item.id} className="receipt-row">
                <span>
                  {item.name}
                  <small>
                    {item.quantity} × {formatMoney(item.price)}
                  </small>
                </span>

                <span>{formatMoney(item.quantity * item.price)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <span>TOTAL</span>
            <strong>{formatMoney(receipt.total)}</strong>
          </div>

          <p className="receipt-payment-status">PAYMENT: DEMO SUCCESS</p>

          <p className="receipt-footer">Thank you for shopping with us!</p>

          <p className="receipt-disclaimer">
            This is a demonstration receipt, not proof of a real payment.
          </p>
        </div>

        <div className="receipt-actions no-print">
          <button
            type="button"
            className="primary-button"
            onClick={printReceipt}
          >
            <Printer size={19} />
            Print Receipt
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onNewSession}
          >
            <RotateCcw size={18} />
            New Customer
          </button>
        </div>
      </section>
    </div>
  );
}
