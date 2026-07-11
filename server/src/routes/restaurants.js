import { Router } from "express";
import { db } from "../db.js";
import { ApiError } from "../middleware/errorHandlers.js";

const router = Router();

function hydrateRestaurant(row) {
  return {
    ...row,
    cuisines: JSON.parse(row.cuisines),
    isVegOnly: !!row.is_veg_only,
    isPromoted: !!row.is_promoted,
    discountText: row.discount_text,
    avgRating: row.avg_rating,
    ratingCount: row.rating_count,
    deliveryTime: { min: row.delivery_min, max: row.delivery_max },
    costForTwo: row.cost_for_two,
  };
}

/**
 * GET /api/restaurants
 * Supports optional query params:
 *   q         - free text search across name and cuisines
 *   cuisine   - exact cuisine filter
 *   vegOnly   - "true" to only show pure-veg restaurants
 *   minRating - minimum avg rating (number)
 *   sort      - "rating" | "deliveryTime" | "costLowToHigh" | "costHighToLow"
 */
router.get("/", (req, res) => {
  const { q, cuisine, vegOnly, minRating, sort } = req.query;

  let rows = db.prepare("SELECT * FROM restaurants").all().map(hydrateRestaurant);

  if (q) {
    const needle = String(q).toLowerCase().trim();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.cuisines.some((c) => c.toLowerCase().includes(needle)) ||
        r.area.toLowerCase().includes(needle)
    );
  }

  if (cuisine) {
    rows = rows.filter((r) => r.cuisines.some((c) => c.toLowerCase() === String(cuisine).toLowerCase()));
  }

  if (vegOnly === "true") {
    rows = rows.filter((r) => r.isVegOnly);
  }

  if (minRating) {
    rows = rows.filter((r) => r.avgRating >= Number(minRating));
  }

  switch (sort) {
    case "rating":
      rows.sort((a, b) => b.avgRating - a.avgRating);
      break;
    case "deliveryTime":
      rows.sort((a, b) => a.deliveryTime.min - b.deliveryTime.min);
      break;
    case "costLowToHigh":
      rows.sort((a, b) => a.costForTwo - b.costForTwo);
      break;
    case "costHighToLow":
      rows.sort((a, b) => b.costForTwo - a.costForTwo);
      break;
    default:
      break;
  }

  res.json({ count: rows.length, restaurants: rows });
});

// GET /api/restaurants/cuisines — distinct cuisine list, used to build filter chips
router.get("/cuisines", (_req, res) => {
  const rows = db.prepare("SELECT cuisines FROM restaurants").all();
  const set = new Set();
  rows.forEach((r) => JSON.parse(r.cuisines).forEach((c) => set.add(c)));
  res.json({ cuisines: Array.from(set).sort() });
});

// GET /api/restaurants/:id — restaurant details + full menu grouped by category
router.get("/:id", (req, res, next) => {
  try {
    const restaurant = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(req.params.id);
    if (!restaurant) {
      throw new ApiError(404, "We couldn't find that restaurant. It may have closed down.");
    }

    const items = db
      .prepare("SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category, name")
      .all(req.params.id);

    const menuByCategory = items.reduce((acc, item) => {
      const bucket = acc.find((b) => b.category === item.category);
      const shaped = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageId: item.image_id,
        isVeg: !!item.is_veg,
        isBestseller: !!item.is_bestseller,
        rating: item.rating,
      };
      if (bucket) {
        bucket.items.push(shaped);
      } else {
        acc.push({ category: item.category, items: [shaped] });
      }
      return acc;
    }, []);

    res.json({
      restaurant: hydrateRestaurant(restaurant),
      menu: menuByCategory,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
