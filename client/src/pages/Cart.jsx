import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartRestaurantName,
  selectCartSubtotal,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
} from "../features/cart/cartSlice";

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

export default function Cart() {
  const items = useSelector(selectCartItems);
  const restaurantName = useSelector(selectCartRestaurantName);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taxes = Math.round(subtotal * TAX_RATE);
  const total = items.length > 0 ? subtotal + DELIVERY_FEE + taxes : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <EmptyCartIllustration />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add items from a restaurant to see them here.</p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-tandoori px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your cart</h1>
          <p className="text-sm text-muted">from {restaurantName}</p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm font-semibold text-tandoori-dark hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-ink">{item.name}</h3>
              <p className="font-mono text-sm text-muted">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-line px-2 py-1">
              <button
                onClick={() => dispatch(decrementItem(item.id))}
                className="flex h-6 w-6 items-center justify-center rounded text-tandoori hover:bg-paper-warm"
                aria-label={`Remove one ${item.name}`}
              >
                −
              </button>
              <span className="w-4 text-center font-mono text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => dispatch(incrementItem(item.id))}
                className="flex h-6 w-6 items-center justify-center rounded text-tandoori hover:bg-paper-warm"
                aria-label={`Add one more ${item.name}`}
              >
                +
              </button>
            </div>

            <p className="w-16 shrink-0 text-right font-mono text-sm font-semibold text-ink">
              ₹{item.price * item.quantity}
            </p>

            <button
              onClick={() => dispatch(removeItem(item.id))}
              className="shrink-0 text-muted hover:text-tandoori-dark"
              aria-label={`Remove ${item.name} from cart`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 font-mono text-sm">
        <Row label="Subtotal" value={subtotal} />
        <Row label="Delivery fee" value={DELIVERY_FEE} />
        <Row label="Taxes & charges" value={taxes} />
        <div className="ticket-divider my-3" />
        <Row label="Total" value={total} bold />
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full rounded-2xl bg-tandoori py-4 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.01]"
      >
        Proceed to checkout · ₹{total}
      </button>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? "text-base font-bold text-ink" : "text-ink/70"}`}>
      <span className={bold ? "font-sans" : "font-sans"}>{label}</span>
      <span>₹{value}</span>
    </div>
  );
}

function EmptyCartIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="48" fill="var(--color-paper-warm)" />
      <path
        d="M28 34h4l3 24h30l6-18H36"
        stroke="var(--color-tandoori)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="40" cy="66" r="3.5" fill="var(--color-tandoori)" />
      <circle cx="60" cy="66" r="3.5" fill="var(--color-tandoori)" />
    </svg>
  );
}
