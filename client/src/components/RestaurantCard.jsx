import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const { id, name, image_id, cuisines, area, avgRating, deliveryTime, costForTwo, discountText, isVegOnly } =
    restaurant;

  return (
    <Link
      to={`/restaurants/${id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image_id}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discountText && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/90 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {discountText}
          </span>
        )}
        {isVegOnly && (
          <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-sm border-2 border-curry bg-white">
            <span className="h-2 w-2 rounded-full bg-curry" />
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-ink leading-snug line-clamp-1">{name}</h3>
          <span
            className={`flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold ${
              avgRating >= 4 ? "bg-curry-light text-curry" : "bg-paper-warm text-tandoori-dark"
            }`}
          >
            ★ {avgRating}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-muted">{cuisines.join(", ")}</p>
        <p className="text-xs text-muted">{area}</p>

        <div className="ticket-divider my-3" />

        <div className="flex items-center justify-between font-mono text-xs text-ink/70">
          <span>
            {deliveryTime.min}–{deliveryTime.max} mins
          </span>
          <span>₹{costForTwo} for two</span>
        </div>
      </div>
    </Link>
  );
}
