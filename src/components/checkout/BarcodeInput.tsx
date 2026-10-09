"use client";

import { FormEvent, RefObject, useEffect, useState } from "react";
import { Keyboard, ScanBarcode } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onScan: (barcode: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
};

export default function BarcodeInput({
  value,
  onChange,
  onScan,
  inputRef,
  disabled = false,
}: Props) {
  const [manualEntryOpen, setManualEntryOpen] = useState(false);

  useEffect(() => {
    if (manualEntryOpen && !disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef, manualEntryOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!value.trim() || disabled) return;

    onScan(value);
  }

  return (
    <section className="scan-panel">
      <div className="section-heading">
        <div className="icon-box">
          <ScanBarcode size={26} />
        </div>

        <div>
          <h2>Scan Your Items</h2>
          <p>Scan the barcode on your product.</p>
        </div>
      </div>

      <div className="scanner-status">
        <span className="status-dot" />
        Scanner ready
      </div>

      {!manualEntryOpen ? (
        <button
          type="button"
          className="manual-entry-trigger"
          disabled={disabled}
          onClick={() => setManualEntryOpen(true)}
        >
          <Keyboard size={18} />
          Enter barcode manually
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="barcode-form">
          <label htmlFor="barcode-input">
            <Keyboard size={18} />
            Enter barcode manually
          </label>

          <div className="barcode-controls">
            <input
              ref={inputRef}
              id="barcode-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              disabled={disabled}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Type barcode number"
              aria-label="Product barcode"
            />

            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="primary-button scan-button"
            >
              Add Item
            </button>
          </div>

          <div className="manual-entry-footer">
            <p className="helper-text">
              Type the barcode number, then press Add Item.
            </p>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                onChange("");
                setManualEntryOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
