import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .getOrder(orderId)
      .then((data) => {
        setOrder(data.order);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [orderId]);

  if (status === "loading") {
    return <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-muted">Loading your order…</div>;
  }

  if (status === "error" || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="font-display text-xl font-semibold">We couldn't find that order</h2>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-tandoori">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-curry-light [animation:slideUp_0.3s_ease-out]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="var(--color-curry)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Order placed!</h1>
      <p className="mt-1.5 text-sm text-muted">Your order from {order.restaurant_name} is on its way.</p>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">Order #{order.id}</span>
          <span className="rounded-full bg-paper-warm px-2.5 py-1 text-[11px] font-bold uppercase text-tandoori-dark">
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="mt-4 space-y-1.5 font-mono text-xs text-ink/70">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="truncate pr-2">
                {item.quantity} × {item.item_name}
              </span>
              <span>₹{item.unit_price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="ticket-divider my-3" />

        <div className="flex justify-between font-mono text-sm font-bold text-ink">
          <span>Total paid</span>
          <span>₹{order.total}</span>
        </div>

        <div className="ticket-divider my-3" />

        <p className="text-xs text-muted">
          Delivering to <span className="text-ink">{order.address}</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          Paying via <span className="text-ink uppercase">{order.payment_method}</span>
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to="/orders"
          className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-ink"
        >
          View all orders
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-xl bg-tandoori py-3 text-sm font-semibold text-white"
        >
          Order more
        </Link>
      </div>
    </div>
  );
}
