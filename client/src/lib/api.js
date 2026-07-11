// Centralized fetch wrapper. Every API call in the app goes through here so
// error handling, JSON parsing, and the base URL are defined in exactly one
// place instead of being copy-pasted across components.

const BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api`;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response body — leave body as null.
  }

  if (!response.ok) {
    throw new ApiError(body?.error || "Something went wrong. Please try again.", response.status);
  }

  return body;
}

export const api = {
  getRestaurants: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null))
    ).toString();
    return request(`/restaurants${query ? `?${query}` : ""}`);
  },
  getCuisines: () => request("/restaurants/cuisines"),
  getRestaurant: (id) => request(`/restaurants/${id}`),
  placeOrder: (payload) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
};

export { ApiError };
