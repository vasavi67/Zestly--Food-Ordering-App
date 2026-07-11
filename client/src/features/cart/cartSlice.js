import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "zestly.cart.v1";

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { restaurantId: null, restaurantName: null, items: [] };
    return JSON.parse(raw);
  } catch {
    // Corrupt or inaccessible storage shouldn't crash the app — start fresh.
    return { restaurantId: null, restaurantName: null, items: [] };
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage might be full or blocked (private browsing) — fail silently,
    // the cart still works in-memory for the session.
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadInitialState(),
  reducers: {
    // Adds an item. If the cart currently belongs to a different restaurant,
    // callers should dispatch clearCart first (the UI confirms with the user).
    addItem: (state, action) => {
      const { restaurantId, restaurantName, item } = action.payload;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      persist(state);
    },
    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      persist(state);
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      persist(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      persist(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      persist(state);
    },
  },
});

export const { addItem, incrementItem, decrementItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartRestaurantId = (state) => state.cart.restaurantId;
export const selectCartRestaurantName = (state) => state.cart.restaurantName;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
