import { Router } from "express";
import { db } from "../db.js";
import { ApiError } from "../middleware/errorHandlers.js";

const router = Router();

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5% flat, illustrative only — not real GST logic

function validateOrderPayload(body) {
  const { restaurantId, items, address, paymentMethod } = body;

  if (!restaurantId || typeof restaurantId !== "string") {
    throw new ApiError(400, "Order is missing a restaurant.");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Your cart is empty — add an item before placing an order.");
  }
  for (const item of items) {
    if (!item.name || typeof item.price !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new ApiError(400, "One of the items in your cart looks invalid. Please refresh and try again.");
    }
  }
  if (!address || String(address).trim().length < 8) {
    throw new ApiError(400, "Please enter a complete delivery address.");
  }
  if (!["upi", "card", "cod"].includes(paymentMethod)) {
    throw new ApiError(400, "Please choose a valid payment method.");
  }
}

// POST /api/orders — place a new order
router.post("/", (req, res, next) => {
  try {
    validateOrderPayload(req.body);
    const { restaurantId, items, address, paymentMethod } = req.body;

    const restaurant = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(restaurantId);
    if (!restaurant) {
      throw new ApiError(404, "That restaurant is no longer available.");
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxes = Math.round(subtotal * TAX_RATE);
    const total = subtotal + DELIVERY_FEE + taxes;

    const insertOrder = db.prepare(`
      INSERT INTO orders (restaurant_id, restaurant_name, subtotal, delivery_fee, taxes, total, address, payment_method)
      VALUES (@restaurant_id, @restaurant_name, @subtotal, @delivery_fee, @taxes, @total, @address, @payment_method)
    `);
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, item_name, unit_price, quantity)
      VALUES (@order_id, @item_name, @unit_price, @quantity)
    `);

    const placeOrder = db.transaction(() => {
      const result = insertOrder.run({
        restaurant_id: restaurantId,
        restaurant_name: restaurant.name,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        taxes,
        total,
        address: String(address).trim(),
        payment_method: paymentMethod,
      });
      const orderId = result.lastInsertRowid;
      for (const item of items) {
        insertItem.run({
          order_id: orderId,
          item_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
        });
      }
      return orderId;
    });

    const orderId = placeOrder();
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    const orderItems = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId);

    res.status(201).json({ order: { ...order, items: orderItems } });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — order history, most recent first
router.get("/", (_req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  const itemsByOrder = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  const shaped = orders.map((o) => ({ ...o, items: itemsByOrder.all(o.id) }));
  res.json({ orders: shaped });
});

// GET /api/orders/:id — a single order's details
router.get("/:id", (req, res, next) => {
  try {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
    if (!order) {
      throw new ApiError(404, "We couldn't find that order.");
    }
    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
    res.json({ order: { ...order, items } });
  } catch (err) {
    next(err);
  }
});

export default router;
