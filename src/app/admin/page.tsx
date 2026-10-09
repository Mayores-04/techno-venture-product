import Link from "next/link";
import { Package, ShoppingCart, Warehouse } from "lucide-react";

import { formatMoney } from "@/src/lib/products";

export default function AdminPage() {
  return (
    <main className="kiosk-content">
      <div className="welcome-heading">
        <h1>Admin dashboard</h1>
        <p>Manage the demo store inventory and review checkout activity.</p>
      </div>

      <div className="checkout-layout">
        <Link className="cart-panel" href="/admin/products">
          <Package size={30} />
          <h2>Products</h2>
          <p>View the products available at checkout.</p>
        </Link>

        <Link className="cart-panel" href="/admin/inventory">
          <Warehouse size={30} />
          <h2>Inventory</h2>
          <p>Review current stock levels.</p>
        </Link>

        <Link className="cart-panel" href="/admin/transactions">
          <ShoppingCart size={30} />
          <h2>Transactions</h2>
          <p>Review the demo transaction summary.</p>
        </Link>
      </div>

      <p className="secure-note">
        Demo catalog value: {formatMoney(0)} until transactions are connected
        to persistent storage.
      </p>
    </main>
  );
}