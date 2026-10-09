import Link from "next/link";

import { formatMoney, getProducts } from "@/src/lib/products";

export default function ProductsPage() {
  const products = getProducts();

  return (
    <main className="kiosk-content">
      <Link className="text-button" href="/admin">
        Back to dashboard
      </Link>
      <div className="welcome-heading">
        <h1>Products</h1>
        <p>{products.length} products are available in the demo catalog.</p>
      </div>

      <section className="cart-panel">
        <div className="receipt-table">
          <div className="receipt-table-heading">
            <span>Product</span>
            <span>Barcode</span>
            <span>Price</span>
            <span>Stock</span>
          </div>
          {products.map((product) => (
            <div className="receipt-table-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.barcode}</span>
              <span>{formatMoney(product.price)}</span>
              <span>{product.stock}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}