"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CreditCard,
  ClipboardList,
  Keyboard,
  ScanBarcode,
  ShoppingBag,
  ShoppingCart,
  Store,
} from "lucide-react";

import BarcodeInput from "@/src/components/checkout/BarcodeInput";
import Cart from "@/src/components/checkout/Cart";
import PaymentDialog from "@/src/components/checkout/PaymentDialog";
import ProductBrowser from "@/src/components/checkout/ProductBrowser";
import Receipt, { type ReceiptData } from "@/src/components/checkout/Receipt";
import Scanner from "@/src/components/checkout/Scanner";
import {
  findProductByBarcode,
  formatMoney,
  getProducts,
  type CartItem,
  type Product,
} from "@/src/lib/products";

const SCAN_COOLDOWN_MS = 1200;

type Screen = "scan" | "products" | "cart" | "checkout" | "payment" | "receipt";
type ScanMode = "camera" | "manual";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("scan");
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const scanSoundRef = useRef<HTMLAudioElement>(null);
  const lastAcceptedScanTimeRef = useRef(0);

  const products = useMemo(() => getProducts(), []);
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  function showMessage(text: string, type: "success" | "error" | "info" = "info") {
    setStatusMessage({ text, type });
  }

  function playScanSuccessSound() {
    const audio = scanSoundRef.current;

    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  function addProductToCart(product: Product) {
    if (product.stock <= 0) {
      showMessage(`${product.name} is currently unavailable.`, "error");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          showMessage("You have reached the available stock for this item.", "error");
          return current;
        }

        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    showMessage(`${product.name} added to your cart.`, "success");
    playScanSuccessSound();
  }

  function handleScan(value: string) {
    const code = value.trim();

    if (!code || screen === "payment" || Boolean(receipt)) return;

    const product = findProductByBarcode(code);
    setBarcode("");

    if (!product) {
      showMessage("Barcode not recognized. Please check the item and try again.", "error");
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    if (existing && existing.quantity >= product.stock) {
      showMessage("Maximum available quantity reached for this item.", "error");
      return;
    }

    const now = Date.now();
    if (now - lastAcceptedScanTimeRef.current < SCAN_COOLDOWN_MS) {
      return;
    }

    lastAcceptedScanTimeRef.current = now;
    addProductToCart(product);
  }

  function changeQuantity(id: number, quantity: number) {
    const item = cart.find((current) => current.id === id);

    if (!item) return;

    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (quantity > item.stock) {
      showMessage("Requested quantity exceeds the available stock.", "error");
      return;
    }

    setCart((current) =>
      current.map((currentItem) =>
        currentItem.id === id ? { ...currentItem, quantity } : currentItem,
      ),
    );

    setStatusMessage(null);
  }

  function removeItem(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));
    setStatusMessage({ text: "Item removed from your cart.", type: "info" });
  }

  function clearCart() {
    setCart([]);
    setStatusMessage({ text: "Cart cleared.", type: "info" });
  }

  function proceedToCheckout() {
    if (cart.length === 0) {
      showMessage("Add at least one item before continuing to checkout.", "error");
      return;
    }

    setScreen("checkout");
    setStatusMessage(null);
  }

  function completeDemoPayment() {
    const receiptNumber = `DEMO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    setReceipt({
      number: receiptNumber,
      date: new Date().toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      items: cart.map((item) => ({ ...item })),
      total,
    });
    setCart([]);
    setScreen("receipt");
    setStatusMessage(null);
  }

  function startNewSession() {
    setCart([]);
    setBarcode("");
    setReceipt(null);
    setStatusMessage(null);
    setScreen("scan");
  }

  function handlePaymentClose() {
    setScreen("cart");
    setStatusMessage({ text: "Payment cancelled. Your cart has been preserved.", type: "info" });
  }

  const activeInstructionStep =
    screen === "products"
      ? "products"
      : screen === "cart"
        ? "cart"
        : screen === "checkout" || screen === "payment" || screen === "receipt"
          ? "pay"
          : "scan";

  const renderScanScreen = () => (
    <div className="terminal-grid">
      <section className="terminal-column scanner-column">
        <div className="scan-mode-control" role="group" aria-label="Barcode entry mode">
          <button
            type="button"
            className={scanMode === "camera" ? "scan-mode-button is-active" : "scan-mode-button"}
            aria-pressed={scanMode === "camera"}
            onClick={() => setScanMode("camera")}
          >
            <Camera size={18} />
            Scan Barcode
          </button>

          <button
            type="button"
            className={scanMode === "manual" ? "scan-mode-button is-active" : "scan-mode-button"}
            aria-pressed={scanMode === "manual"}
            onClick={() => setScanMode("manual")}
          >
            <Keyboard size={18} />
            Enter Barcode Manually
          </button>
        </div>

        <div className="scan-heading-row">
          <div>
            <p className="section-kicker">SCAN YOUR ITEMS</p>
            <h2>Ready to scan</h2>
          </div>

          <span className="scanner-ready-badge">READY TO SCAN</span>
        </div>

        {scanMode === "camera" ? (
          <Scanner onScan={handleScan} enabled={screen === "scan"} />
        ) : (
          <BarcodeInput
            value={barcode}
            onChange={setBarcode}
            onScan={handleScan}
            inputRef={barcodeRef}
            disabled={Boolean(receipt)}
          />
        )}

        {statusMessage && (
          <p role="status" className={`status-message status-message--${statusMessage.type}`}>
            {statusMessage.text}
          </p>
        )}
      </section>

      <section className="terminal-column cart-column">
        <div className="cart-column-heading">
          <div>
            <p className="section-kicker">SHOPPING CART</p>
            <h2>Current items</h2>
          </div>

          <span className="item-count">{itemCount} items</span>
        </div>

        <Cart
          items={cart}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
          onClear={clearCart}
          onCheckout={proceedToCheckout}
          disabled={Boolean(receipt)}
        />
      </section>
    </div>
  );

  const renderCheckoutScreen = () => (
    <section className="panel-card">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <div className="panel-icon panel-icon--gray">
            <CreditCard size={20} />
          </div>

          <div>
            <p className="section-kicker">CHECKOUT</p>
            <h2>Review order</h2>
          </div>
        </div>
      </div>

      <div className="checkout-review-list">
        {cart.map((item) => (
          <div key={item.id} className="checkout-item-row">
            <div className="checkout-item-copy">
              <strong>{item.name}</strong>
              <span>
                {item.quantity} × {formatMoney(item.price)}
              </span>
            </div>
            <span>{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="checkout-total-box">
        <div>
          <span>Total</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>

      <div className="checkout-actions">
        <button type="button" className="secondary-button" onClick={() => setScreen("cart")}>
          <ArrowLeft size={16} />
          Back to cart
        </button>

        <button type="button" className="primary-button" onClick={() => setScreen("payment")}>
          Confirm and continue
        </button>
      </div>
    </section>
  );

  return (
    <main className="checkout-app-shell">
      <audio ref={scanSoundRef} src="/scanned_sound.mp3" preload="auto" aria-hidden="true" />

      <div className="terminal-shell">
        <section className="instruction-bar" aria-label="How to use this cart">
          <div className="instruction-bar-heading">
            <span className="instruction-bar-label">HOW TO USE THIS CART</span>
            <span className="instruction-bar-demo">DEMO MODE</span>
          </div>

          <ol className="instruction-steps">
            {[
              {
                id: "scan",
                title: "Scan items",
                description: "Scan each barcode.",
                icon: <ScanBarcode size={18} />,
              },
              {
                id: "products",
                title: "Browse products",
                description: "Check prices or add items.",
                icon: <ShoppingBag size={18} />,
              },
              {
                id: "cart",
                title: "Review cart",
                description: "Check quantities and total.",
                icon: <ClipboardList size={18} />,
              },
              {
                id: "pay",
                title: "Pay",
                description: "Confirm and use the terminal.",
                icon: <CreditCard size={18} />,
              },
            ].map((step, index) => (
              <li
                key={step.id}
                className={step.id === activeInstructionStep ? "instruction-step is-active" : "instruction-step"}
              >
                <span className="instruction-step-marker">
                  <span>{index + 1}</span>
                  {step.icon}
                </span>
                <span className="instruction-step-copy">
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="screen-panel">
          {screen === "scan" && renderScanScreen()}

          {screen === "products" && (
            <ProductBrowser
              products={products}
              cartCount={itemCount}
            />
          )}

          {screen === "cart" && (
            <Cart
              items={cart}
              onQuantityChange={changeQuantity}
              onRemove={removeItem}
              onClear={clearCart}
              onCheckout={proceedToCheckout}
              disabled={Boolean(receipt)}
            />
          )}

          {screen === "checkout" && renderCheckoutScreen()}

          {screen === "receipt" && receipt && <Receipt receipt={receipt} onNewSession={startNewSession} />}
        </div>

        {!receipt && screen !== "payment" && (
          <nav className="checkout-nav" aria-label="Smart checkout navigation">
            <button
              type="button"
              className={screen === "scan" ? "checkout-nav-button is-active" : "checkout-nav-button"}
              onClick={() => setScreen("scan")}
            >
              <ScanBarcode size={20} />
              <span>Scan</span>
            </button>

            <button
              type="button"
              className={screen === "products" ? "checkout-nav-button is-active" : "checkout-nav-button"}
              onClick={() => setScreen("products")}
            >
              <Store size={20} />
              <span>Products</span>
            </button>

            <button
              type="button"
              className={screen === "cart" || screen === "checkout" ? "checkout-nav-button is-active" : "checkout-nav-button"}
              onClick={() => setScreen("cart")}
            >
              <span className="checkout-nav-icon">
                <ShoppingCart size={20} />
                {itemCount > 0 && <strong>{itemCount}</strong>}
              </span>
              <span>Cart</span>
            </button>
          </nav>
        )}
      </div>

      {screen === "payment" && (
        <PaymentDialog total={total} onSuccess={completeDemoPayment} onClose={handlePaymentClose} />
      )}
    </main>
  );
}
