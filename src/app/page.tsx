"use client";

import { useRef, useState } from "react";
import { Store } from "lucide-react";

import BarcodeInput from "@/src/components/checkout/BarcodeInput";
import Cart from "@/src/components/checkout/Cart";
import PaymentDialog from "@/src/components/checkout/PaymentDialog";
import Receipt, { type ReceiptData } from "@/src/components/checkout/Receipt";
import { findProductByBarcode, type CartItem } from "@/src/lib/products";
import Scanner from "@/src/components/checkout/Scanner";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);

  function focusScanner() {
    window.setTimeout(() => {
      barcodeRef.current?.focus();
    }, 100);
  }

  function showMessage(text: string, type: "success" | "error") {
    setMessage(text);
    setMessageType(type);
  }

  function scanProduct(value: string) {
    const code = value.trim();

    if (!code || paymentOpen || receipt) return;

    const product = findProductByBarcode(code);

    setBarcode("");

    if (!product) {
      showMessage(
        "Barcode not recognized. Please check the number and try again.",
        "error",
      );

      focusScanner();
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    if (existing && existing.quantity >= product.stock) {
      showMessage("Maximum available quantity reached for this item.", "error");

      focusScanner();
      return;
    }

    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    showMessage(`${product.name} added to your items.`, "success");

    focusScanner();
  }

  function changeQuantity(id: number, quantity: number) {
    const item = cart.find((current) => current.id === id);

    if (!item) return;

    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (quantity > item.stock) {
      showMessage("Requested quantity exceeds demo stock.", "error");
      return;
    }

    setCart((current) =>
      current.map((currentItem) =>
        currentItem.id === id ? { ...currentItem, quantity } : currentItem,
      ),
    );

    setMessage("");
  }

  function removeItem(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));

    setMessage("Item removed from your cart.");
    setMessageType("success");
    focusScanner();
  }

  function clearCart() {
    setCart([]);
    setMessage("All items have been removed.");
    setMessageType("success");
    focusScanner();
  }

  function completeDemoPayment() {
    const purchasedItems = cart.map((item) => ({
      ...item,
    }));

    const total = purchasedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newReceipt: ReceiptData = {
      number: `DEMO-${Date.now()}`,
      date: new Date().toLocaleString("en-PH"),
      items: purchasedItems,
      total,
    };

    setReceipt(newReceipt);
    setPaymentOpen(false);
    setCart([]);
    setMessage("");
  }

  function startNewSession() {
    setCart([]);
    setBarcode("");
    setMessage("");
    setPaymentOpen(false);
    setReceipt(null);
    focusScanner();
  }

  return (
    <main className="kiosk-shell">
      <header className="kiosk-header">
        <div className="brand">
          <div className="brand-icon">
            <Store size={25} />
          </div>

          <div>
            <h1>MINI MART</h1>
            <p>SELF-SERVICE CHECKOUT</p>
          </div>
        </div>

        <div className="demo-badge">
          <span />
          DEMO MODE
        </div>
      </header>

      <div className="kiosk-content">
        <div className="welcome-heading">
          <h2>Welcome! Scan your items.</h2>
          <p>
            Scan each product you want to purchase. Review your items before
            proceeding to payment.
          </p>
        </div>

        <div className="checkout-layout">
          <div className="checkout-left">
            {!paymentOpen && !receipt && <Scanner onScan={scanProduct} />}

            <BarcodeInput
              value={barcode}
              onChange={setBarcode}
              onScan={scanProduct}
              inputRef={barcodeRef}
              disabled={paymentOpen || Boolean(receipt)}
            />

            {message && (
              <p role="status" className={`status-message ${messageType}`}>
                {message}
              </p>
            )}

            <div className="scanner-help">
              <Store size={20} />

              <div>
                <h3>Need help?</h3>
                <p>
                  If a barcode cannot be scanned, enter its number manually. Ask
                  store staff for assistance if the product is not recognized.
                </p>
              </div>
            </div>
          </div>

          <Cart
            items={cart}
            onQuantityChange={changeQuantity}
            onRemove={removeItem}
            onClear={clearCart}
            onCheckout={() => {
              if (cart.length > 0) {
                setMessage("");
                setPaymentOpen(true);
              }
            }}
            disabled={paymentOpen || Boolean(receipt)}
          />
        </div>

        <footer className="kiosk-footer">
          <p>Self-Service Checkout</p>
          <p>Secure checkout experience · Demo only</p>
        </footer>
      </div>

      {paymentOpen && (
        <PaymentDialog
          total={cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          )}
          onSuccess={completeDemoPayment}
          onClose={() => {
            setPaymentOpen(false);
            focusScanner();
          }}
        />
      )}

      {receipt && <Receipt receipt={receipt} onNewSession={startNewSession} />}
    </main>
  );
}
