export default function MenuItemRow({ item, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <VegIndicator isVeg={item.isVeg} />
          {item.isBestseller && (
            <span className="rounded bg-paper-warm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tandoori-dark">
              Bestseller
            </span>
          )}
        </div>
        <h4 className="mt-1 font-semibold text-ink">{item.name}</h4>
        <p className="font-mono text-sm text-ink/80">₹{item.price}</p>
        {item.description && <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{item.description}</p>}
      </div>

      <div className="shrink-0">
        {item.imageId && (
          <div className="relative mb-2 h-20 w-24 overflow-hidden rounded-lg">
            <img src={item.imageId} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <button
          onClick={onAdd}
          className="w-24 rounded-lg border border-tandoori bg-white py-2 text-xs font-bold text-tandoori shadow-sm transition-colors hover:bg-tandoori hover:text-white"
        >
          ADD
        </button>
      </div>
    </div>
  );
}

function VegIndicator({ isVeg }) {
  return (
    <span
      className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 ${
        isVeg ? "border-curry" : "border-tandoori-dark"
      }`}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-curry" : "bg-tandoori-dark"}`} />
    </span>
  );
}
