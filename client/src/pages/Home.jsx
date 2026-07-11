import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../lib/api";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import FilterBar from "../components/FilterBar";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantGridSkeleton from "../components/RestaurantGridSkeleton";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState("");

  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    api.getCuisines().then((data) => setCuisines(data.cuisines)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOnline) return;
    let cancelled = false;
    setStatus("loading");

    api
      .getRestaurants({ q: debouncedSearch, cuisine: activeCuisine, vegOnly: vegOnly || undefined, sort })
      .then((data) => {
        if (cancelled) return;
        setRestaurants(data.restaurants);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err instanceof ApiError ? err.message : "Couldn't load restaurants. Please try again.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, activeCuisine, vegOnly, sort, isOnline]);

  const hasActiveFilters = useMemo(
    () => debouncedSearch || activeCuisine || vegOnly,
    [debouncedSearch, activeCuisine, vegOnly]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="mb-10 md:mb-14">
        <p className="font-mono text-xs font-semibold tracking-wide text-tandoori uppercase">
          Delivering across Hyderabad &amp; Vizianagaram
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Find your next favourite meal.
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted md:text-base">
          Search restaurants by cuisine, area, or craving — order in a few taps.
        </p>
      </section>

      <section className="mb-8">
        <FilterBar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          cuisines={cuisines}
          activeCuisine={activeCuisine}
          onCuisineChange={setActiveCuisine}
          vegOnly={vegOnly}
          onVegOnlyChange={setVegOnly}
          sort={sort}
          onSortChange={setSort}
        />
      </section>

      {!isOnline && (
        <EmptyState
          title="You're offline"
          message="Reconnect to the internet to browse restaurants."
        />
      )}

      {isOnline && status === "loading" && <RestaurantGridSkeleton />}

      {isOnline && status === "error" && (
        <EmptyState title="Couldn't load restaurants" message={errorMessage} showRetry />
      )}

      {isOnline && status === "ready" && restaurants.length === 0 && (
        <EmptyState
          title="No restaurants match your search"
          message={
            hasActiveFilters
              ? "Try a different keyword or clear your filters."
              : "Check back soon — we're adding more restaurants."
          }
        />
      )}

      {isOnline && status === "ready" && restaurants.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, message, showRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 py-20 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      {showRetry && (
        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-full bg-tandoori px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
