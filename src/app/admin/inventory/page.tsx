import Link from "next/link";

import { getProducts } from "@/src/lib/products";

export default function InventoryPage() {
  const products = getProducts();

  return (
    <main className="kiosk-content">
      <Link className="text-button" href="/admin">
        Back to dashboard
      </Link>
      <div className="welcome-heading">
        <h1>Inventory</h1>
        <p>Current stock levels for the demo catalog.</p>
      </div>

      <section className="cart-panel">
        <div className="receipt-table">
          <div className="receipt-table-heading">
            <span>Product</span>
            <span>Stock</span>
            <span>Status</span>
          </div>
          {products.map((product) => (
            <div className="receipt-table-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.stock}</span>
              <span>{product.stock > 0 ? "In stock" : "Out of stock"}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}