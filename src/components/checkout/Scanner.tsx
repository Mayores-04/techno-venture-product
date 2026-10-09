"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ScanLine, ShieldCheck } from "lucide-react";

type ScannerProps = {
  onScan: (barcode: string) => void;
};

export default function Scanner({ onScan }: ScannerProps) {
  const onScanRef = useRef(onScan);
  const lastScanRef = useRef({ value: "", time: 0 });

  const [status, setStatus] = useState<"starting" | "ready" | "error">(
    "starting",
  );
  const [retryKey, setRetryKey] = useState(0);

  // Always use the latest handler without restarting the camera.
  onScanRef.current = onScan;

  useEffect(() => {
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
              height: Math.floor(Math.min(height * 0.3, 150)),
            }),
            aspectRatio: 1.3333,
          },
          (decodedText) => {
            const barcode = decodedText.trim();
            const now = Date.now();
            const last = lastScanRef.current;

            // Prevent duplicate scans from consecutive camera frames.
            if (barcode === last.value && now - last.time < 1800) {
              return;
            }

            lastScanRef.current = {
              value: barcode,
              time: now,
            };

            if ("vibrate" in navigator) {
              navigator.vibrate(100);
            }

            onScanRef.current(barcode);
          },
          () => {
            // No barcode found in this frame. Keep scanning.
          },
        );

        if (cancelled) {
          await scanner.stop().catch(() => {});
          scanner.clear();
          return;
        }

        setStatus("ready");
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
        if (scanner.isScanning) {
          void scanner
            .stop()
            .then(() => {
              scanner?.clear();
            })
            .catch(() => {});
        } else {
          // clear() returns void in your installed version.
          scanner.clear();
        }
      }
    };
  }, [retryKey]);

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
          {status === "ready" ? "LIVE" : "CAMERA"}
        </span>
      </div>

      <div className="scanner-camera">
        <div id="self-checkout-reader" className="scanner-reader" />

        {status !== "ready" && (
          <div className="scanner-overlay">
            <Camera size={34} />

            {status === "starting" ? (
              <>
                <strong>Starting camera...</strong>
                <span>Allow camera access if prompted.</span>
              </>
            ) : (
              <>
                <strong>Camera unavailable</strong>
                <span>
                  Check camera permission and open this app through HTTPS.
                </span>

                <button
                  type="button"
                  className="scanner-retry"
                  onClick={() => setRetryKey((key) => key + 1)}
                >
                  Try camera again
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
          <p>Keep the product steady and make sure the barcode is well lit.</p>
        </div>
      </div>
    </section>
  );
}
