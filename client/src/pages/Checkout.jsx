import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartRestaurantId,
  selectCartRestaurantName,
  selectCartSubtotal,
  clearCart,
} from "../features/cart/cartSlice";
import { api, ApiError } from "../lib/api";
import { useToast } from "../hooks/useToast";

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Card", hint: "Credit or debit card" },
  { id: "cod", label: "Cash on delivery", hint: "Pay when your order arrives" },
];

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const restaurantId = useSelector(selectCartRestaurantId);
  const restaurantName = useSelector(selectCartRestaurantName);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [addressError, setAddressError] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + taxes;

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (address.trim().length < 8) {
      setAddressError("Please enter a complete delivery address (at least 8 characters).");
      return;
    }
    setAddressError("");
    setIsPlacing(true);

    try {
      const { order } = await api.placeOrder({
        restaurantId,
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        address: address.trim(),
        paymentMethod,
      });
      dispatch(clearCart());
      showToast("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't place your order. Please try again.", {
        type: "error",
      });
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-muted">from {restaurantName}</p>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <fieldset className="rounded-2xl border border-line bg-white p-5">
            <legend className="px-1 font-display text-sm font-semibold text-ink">Delivery address</legend>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="House / flat no., street, area, city, PIN code"
              className={`mt-2 w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none ${
                addressError ? "border-tandoori-dark" : "border-line"
              }`}
              aria-invalid={!!addressError}
              aria-describedby={addressError ? "address-error" : undefined}
            />
            {addressError && (
              <p id="address-error" className="mt-1.5 text-xs font-medium text-tandoori-dark">
                {addressError}
              </p>
            )}
          </fieldset>

          <fieldset className="rounded-2xl border border-line bg-white p-5">
            <legend className="px-1 font-display text-sm font-semibold text-ink">Payment method</legend>
            <div className="mt-2 space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                    paymentMethod === m.id ? "border-tandoori bg-paper-warm" : "border-line"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-ink">{m.label}</span>
                    <span className="block text-xs text-muted">{m.hint}</span>
                  </span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-tandoori"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="h-fit rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Order summary</h2>
          <div className="mt-3 space-y-1.5 font-mono text-xs text-ink/70">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate pr-2">
                  {item.quantity} × {item.name}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="ticket-divider my-3" />
          <div className="space-y-1 font-mono text-xs text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & charges</span>
              <span>₹{taxes}</span>
            </div>
          </div>
          <div className="ticket-divider my-3" />
          <div className="flex justify-between font-mono text-sm font-bold text-ink">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            type="submit"
            disabled={isPlacing}
            className="mt-5 w-full rounded-xl bg-tandoori py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
          >
            {isPlacing ? "Placing order…" : `Place order · ₹${total}`}
          </button>
        </div>
      </form>
    </div>
  );
}
