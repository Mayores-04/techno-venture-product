"use client";

import { Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";

import type { CartItem } from "@/src/lib/products";
import { formatMoney } from "@/src/lib/products";

type Props = {
  items: CartItem[];
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  disabled?: boolean;
};

export default function Cart({
  items,
  onQuantityChange,
  onRemove,
  onClear,
  onCheckout,
  disabled = false,
}: Props) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="cart-panel">
      <div className="cart-heading">
        <div>
          <h2>Your Items</h2>
          <p>Review your scanned products.</p>
        </div>

        <span className="item-count">{itemCount} items</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={46} strokeWidth={1.5} />
          <h3>No items scanned yet</h3>
          <p>Scan your first product to begin.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <div className="product-icon">
                  <Package size={25} />
                </div>

                <div className="product-details">
                  <h3>{item.name}</h3>
                  <p>{formatMoney(item.price)} each</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={disabled}
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      disabled={disabled || item.quantity >= item.stock}
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      <Plus size={15} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      className="remove-button"
                      disabled={disabled}
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <strong className="item-subtotal">
                  {formatMoney(item.price * item.quantity)}
                </strong>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="text-button clear-button"
            disabled={disabled}
            onClick={onClear}
          >
            Clear all items
          </button>
        </>
      )}

      <div className="cart-summary">
        <div className="summary-line">
          <span>Total quantity</span>
          <span>{itemCount}</span>
        </div>

        <div className="total-line">
          <span>Total Amount</span>
          <strong>{formatMoney(total)}</strong>
        </div>

        <button
          type="button"
          className="primary-button checkout-button"
          disabled={items.length === 0 || disabled}
          onClick={onCheckout}
        >
          Proceed to Card Payment
        </button>

        <p className="secure-note">Review your items before continuing.</p>
      </div>
    </section>
  );
}
