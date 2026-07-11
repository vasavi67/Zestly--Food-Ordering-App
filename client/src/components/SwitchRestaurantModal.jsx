export default function SwitchRestaurantModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/40 px-4 [animation:fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl [animation:slideUp_0.2s_ease-out]">
        <h3 className="font-display text-lg font-semibold text-ink">Start a new cart?</h3>
        <p className="mt-2 text-sm text-muted">
          Your cart has items from another restaurant. Adding this item will clear your current cart.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink/80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-tandoori py-2.5 text-sm font-semibold text-white"
          >
            Start new cart
          </button>
        </div>
      </div>
    </div>
  );
}
