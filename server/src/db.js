import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "zestly.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/**
 * Schema
 * -------
 * restaurants  -> core restaurant records
 * menu_items   -> items belonging to a restaurant, grouped by category
 * orders       -> a placed order (header)
 * order_items  -> line items belonging to an order (snapshot of price/name
 *                 at the time of order, so historical orders stay accurate
 *                 even if menu prices change later)
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    image_id      TEXT NOT NULL,
    cuisines      TEXT NOT NULL,          -- JSON array, stored as text
    area          TEXT NOT NULL,
    city          TEXT NOT NULL,
    avg_rating    REAL NOT NULL,
    rating_count  TEXT NOT NULL,
    delivery_min  INTEGER NOT NULL,
    delivery_max  INTEGER NOT NULL,
    cost_for_two  INTEGER NOT NULL,
    is_veg_only   INTEGER NOT NULL DEFAULT 0,
    is_promoted   INTEGER NOT NULL DEFAULT 0,
    discount_text TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id              TEXT PRIMARY KEY,
    restaurant_id   TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category        TEXT NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    price           INTEGER NOT NULL,     -- stored as integer rupees (avoids float rounding)
    image_id        TEXT,
    is_veg          INTEGER NOT NULL DEFAULT 1,
    is_bestseller   INTEGER NOT NULL DEFAULT 0,
    rating          REAL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id   TEXT NOT NULL REFERENCES restaurants(id),
    restaurant_name TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'placed',
    subtotal        INTEGER NOT NULL,
    delivery_fee    INTEGER NOT NULL,
    taxes           INTEGER NOT NULL,
    total           INTEGER NOT NULL,
    address         TEXT NOT NULL,
    payment_method  TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_name   TEXT NOT NULL,
    unit_price  INTEGER NOT NULL,
    quantity    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`);

export default db;
