import Link from "next/link";

export default function TransactionsPage() {
  return (
    <main className="kiosk-content">
      <Link className="text-button" href="/admin">
        Back to dashboard
      </Link>
      <div className="welcome-heading">
        <h1>Transactions</h1>
        <p>Completed transactions will appear here once persistence is added.</p>
      </div>

      <section className="cart-panel">
        <div className="empty-cart">
          <h2>No transactions yet</h2>
          <p>Payments in this prototype are simulated and are not stored.</p>
        </div>
      </section>
    </main>
  );
}