export default function FilterBar({
  searchInput,
  onSearchChange,
  cuisines,
  activeCuisine,
  onCuisineChange,
  vegOnly,
  onVegOnlyChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurants, cuisines, or areas..."
          className="w-full rounded-2xl border border-line bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition-shadow focus:shadow-md"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCuisineChange("")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeCuisine === ""
              ? "border-tandoori bg-tandoori text-white"
              : "border-line bg-white text-ink/70 hover:border-tandoori/50"
          }`}
        >
          All
        </button>
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => onCuisineChange(c === activeCuisine ? "" : c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeCuisine === c
                ? "border-tandoori bg-tandoori text-white"
                : "border-line bg-white text-ink/70 hover:border-tandoori/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/80">
          <span
            role="switch"
            aria-checked={vegOnly}
            onClick={() => onVegOnlyChange(!vegOnly)}
            className={`relative h-5 w-9 rounded-full transition-colors ${vegOnly ? "bg-curry" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                vegOnly ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
          Pure veg only
        </label>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink/80 outline-none"
        >
          <option value="">Sort: Relevance</option>
          <option value="rating">Rating: High to low</option>
          <option value="deliveryTime">Delivery time</option>
          <option value="costLowToHigh">Cost: Low to high</option>
          <option value="costHighToLow">Cost: High to low</option>
        </select>
      </div>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
