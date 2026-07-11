import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api, ApiError } from "../lib/api";
import { addItem, selectCartRestaurantId } from "../features/cart/cartSlice";
import { useToast } from "../hooks/useToast";
import MenuCategoryAccordion from "../components/MenuCategoryAccordion";
import SwitchRestaurantModal from "../components/SwitchRestaurantModal";

export default function RestaurantMenu() {
  const { resId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const cartRestaurantId = useSelector(selectCartRestaurantId);

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [openCategory, setOpenCategory] = useState(0);
  const [pendingItem, setPendingItem] = useState(null); // item waiting on the "switch restaurant?" confirm

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .getRestaurant(resId)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        showToast(err instanceof ApiError ? err.message : "Couldn't load this restaurant.", { type: "error" });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resId]);

  if (status === "loading") return <MenuSkeleton />;
  if (status === "error" || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="font-display text-xl font-semibold">This restaurant isn't available</h2>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-tandoori">
          ← Back to all restaurants
        </Link>
      </div>
    );
  }

  const { restaurant, menu } = data;

  function handleAddItem(item) {
    if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
      setPendingItem(item);
      return;
    }
    dispatch(addItem({ restaurantId: restaurant.id, restaurantName: restaurant.name, item }));
    showToast(`${item.name} added to cart`);
  }

  return (
    <div className="pb-16">
      <div className="bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
          <img
            src={restaurant.image_id}
            alt={restaurant.name}
            className="h-48 w-full rounded-2xl object-cover shadow-lg md:h-40 md:w-56"
          />
          <div className="text-white">
            <h1 className="font-display text-3xl font-semibold">{restaurant.name}</h1>
            <p className="mt-1.5 text-sm text-white/60">{restaurant.cuisines.join(", ")}</p>
            <p className="text-sm text-white/60">{restaurant.area}, {restaurant.city}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-sm">
              <span
                className={`rounded-md px-2 py-1 font-bold ${
                  restaurant.avgRating >= 4 ? "bg-curry text-white" : "bg-tandoori text-white"
                }`}
              >
                ★ {restaurant.avgRating}
              </span>
              <span className="text-white/70">({restaurant.ratingCount} ratings)</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70">
                {restaurant.deliveryTime.min}–{restaurant.deliveryTime.max} mins
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/70">₹{restaurant.costForTwo} for two</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Menu</h2>
        <div className="space-y-3">
          {menu.map((category, index) => (
            <MenuCategoryAccordion
              key={category.category}
              category={category}
              isOpen={index === openCategory}
              onToggle={() => setOpenCategory((prev) => (prev === index ? null : index))}
              onAddItem={handleAddItem}
            />
          ))}
        </div>
      </div>

      {pendingItem && (
        <SwitchRestaurantModal
          onCancel={() => setPendingItem(null)}
          onConfirm={() => {
            dispatch(addItem({ restaurantId: restaurant.id, restaurantName: restaurant.name, item: pendingItem }));
            showToast(`${pendingItem.name} added to cart`);
            setPendingItem(null);
          }}
        />
      )}
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="pb-16">
      <div className="skeleton h-64 w-full" />
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8 md:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
