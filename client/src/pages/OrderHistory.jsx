import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .getOrders()
      .then((data) => {
        setOrders(data.orders);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Your orders</h1>

      {status === "loading" && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-muted">Couldn't load your orders. Please try again later.</p>
      )}

      {status === "ready" && orders.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-white/50 py-16 text-center">
          <h3 className="font-display text-lg font-semibold text-ink">No orders yet</h3>
          <p className="mt-1.5 text-sm text-muted">Your placed orders will show up here.</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-tandoori px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse restaurants
          </Link>
        </div>
      )}

      {status === "ready" && orders.length > 0 && (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/order-confirmation/${order.id}`}
              className="block rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-ink">{order.restaurant_name}</h3>
                <span className="rounded-full bg-paper-warm px-2.5 py-1 text-[11px] font-bold uppercase text-tandoori-dark">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-sm">
                <span className="text-muted">{order.items.length} item{order.items.length === 1 ? "" : "s"}</span>
                <span className="font-bold text-ink">₹{order.total}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
