"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ScanLine, ShieldCheck } from "lucide-react";

type ScannerProps = {
  onScan: (barcode: string) => void;
  enabled?: boolean;
};

export default function Scanner({ onScan, enabled = true }: ScannerProps) {
  const onScanRef = useRef(onScan);
  const lastScanRef = useRef({ value: "", time: 0 });

  const [status, setStatus] = useState<"starting" | "ready" | "error">(
    "starting",
  );
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;

    async function startCamera() {
      setStatus("starting");

      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } =
          await import("html5-qrcode");

        if (cancelled) return;

        scanner = new Html5Qrcode("self-checkout-reader", {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
          ],
        });

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (width, height) => ({
              width: Math.floor(Math.min(width * 0.86, 360)),
              height: Math.floor(Math.min(height * 0.3, 160)),
            }),
            aspectRatio: 1.3333,
          },
          (decodedText) => {
            const barcode = decodedText.trim();
            const now = Date.now();
            const last = lastScanRef.current;

            if (barcode === last.value && now - last.time < 1800) {
              return;
            }

            lastScanRef.current = { value: barcode, time: now };

            if ("vibrate" in navigator) {
              navigator.vibrate(100);
            }

            onScanRef.current(barcode);
          },
          () => {},
        );

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (error) {
        console.error("Camera scanner failed:", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;

      if (scanner) {
        const currentScanner = scanner;

        void currentScanner
          .stop()
          .catch(() => {})
          .finally(() => {
            currentScanner.clear();
          });
      }
    };
  }, [enabled, retryKey]);

  return (
    <section className="scanner-panel">
      <div className="scanner-heading">
        <div className="scanner-heading-icon">
          <ScanLine size={22} />
        </div>

        <div>
          <p className="scanner-eyebrow">SELF-CHECKOUT</p>
          <h2>Scan your item</h2>
        </div>

        <span className="scanner-live">
          <span className="scanner-live-dot" />
          {status === "ready" ? "READY" : "CAMERA"}
        </span>
      </div>

      <div className="scanner-camera">
        <div id="self-checkout-reader" className="scanner-reader" />

        {status !== "ready" && (
          <div className="scanner-overlay">
            <Camera size={34} />

            {status === "starting" ? (
              <>
                <strong>Camera starting</strong>
                <span>Allow camera access when the browser asks. HTTPS is required for secure camera access.</span>
              </>
            ) : (
              <>
                <strong>Camera unavailable</strong>
                <span>Check the device permission and use a secure HTTPS connection, then retry.</span>

                <button
                  type="button"
                  className="scanner-retry"
                  onClick={() => setRetryKey((key) => key + 1)}
                >
                  Retry camera
                </button>
              </>
            )}
          </div>
        )}

        {status === "ready" && (
          <div className="scanner-target" aria-hidden="true">
            <span className="target-corner top-left" />
            <span className="target-corner top-right" />
            <span className="target-corner bottom-left" />
            <span className="target-corner bottom-right" />
            <span className="scanner-laser" />
          </div>
        )}
      </div>

      <div className="scanner-instructions">
        <div className="scanner-instruction-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <strong>Position the barcode inside the frame</strong>
          <p>Keep the barcode steady and well lit. Use the manual fallback if the item cannot be scanned.</p>
        </div>
      </div>
    </section>
  );
}
