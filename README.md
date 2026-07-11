# Zestly 🍽️

A full-stack food ordering web application — browse restaurants, filter and search, build a cart, and complete checkout with a real backend and database behind it.

This project began as a course exercise (a Swiggy-clone frontend built while learning React) and was rebuilt into a production-style application: a real Express + SQLite backend replacing an unofficial third-party API dependency, a redesigned interface with a distinct visual identity, proper validation and error handling throughout, and a project structure organized the way a real full-stack app is organized.

> **Live demo:** [https://zestly-food-ordering-app-2awj.vercel.app/]

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [API reference](#api-reference)
- [Screenshots](#screenshots)
- [Design decisions](#design-decisions)
- [Future improvements](#future-improvements)
- [Author](#author)

---

## Features

**Browsing & discovery**
- Restaurant listing with live search (debounced), cuisine filter chips, pure-veg toggle, and sorting (rating, delivery time, cost)
- Restaurant detail page with a categorized, collapsible menu
- Loading skeletons instead of blank screens or spinners
- Offline detection with a persistent banner

**Cart & checkout**
- Persistent cart (survives page refresh via `localStorage`)
- Quantity controls per item, live subtotal
- Guardrail: adding an item from a different restaurant prompts the user before clearing the existing cart, instead of silently mixing orders
- Full checkout flow: delivery address with validation, payment method selection (UPI / card / cash on delivery)
- Order confirmation page with a real receipt pulled from the database (not just a static "thank you" message)
- Order history page listing all previously placed orders

**Engineering**
- REST API with input validation and consistent error responses
- SQLite database with a proper relational schema (restaurants → menu items, orders → order items)
- Toast notifications for user feedback instead of `console.log` / `alert`
- Centralized API client with a single error-handling path
- Fully responsive layout (mobile, tablet, desktop)

---

## Tech stack

**Frontend**
- React 19 + Vite
- React Router v6
- Redux Toolkit (cart state)
- Tailwind CSS v4

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3`
- REST API, no ORM — raw prepared SQL statements for transparency

---

## Project structure

```
zestly/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── app/            # Redux store
│   │   ├── components/     # Shared UI components
│   │   ├── features/cart/  # Cart Redux slice
│   │   ├── hooks/          # Custom hooks (toast, debounce, online status)
│   │   ├── lib/            # API client
│   │   └── pages/          # Route-level page components
│   └── index.html
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # /api/restaurants, /api/orders
│   │   ├── middleware/     # Error handling
│   │   ├── db.js           # SQLite connection + schema
│   │   ├── seed.js         # Seed data script
│   │   └── index.js        # App entry point
│   └── data/                # SQLite database file (generated, gitignored)
│
└── package.json             # Convenience scripts for both apps
```

---

## Getting started

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/vasavi67/Zestly--Food-Ordering-App
cd zestly

# 2. Install dependencies for both apps
npm run install:all

# 3. Seed the database with sample restaurants and menus
npm run seed

# 4. Start the backend (runs on http://localhost:4000)
npm run dev:server

# 5. In a separate terminal, start the frontend (runs on http://localhost:5173)
npm run dev:client
```

The frontend's dev server proxies `/api/*` requests to the backend automatically — no extra configuration needed.

### Building for production

```bash
npm run build:client
```

The backend serves as a plain Node process (`npm start --prefix server`) — deploy it to any Node host (Render, Railway, Fly.io) and the static frontend build to any static host (Vercel, Netlify), pointing the frontend's API calls at your deployed backend URL.

---

## API reference

| Method | Endpoint                     | Description                                   |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/api/health`                 | Health check                                    |
| GET    | `/api/restaurants`            | List restaurants (supports `q`, `cuisine`, `vegOnly`, `minRating`, `sort`) |
| GET    | `/api/restaurants/cuisines`   | Distinct list of cuisines                       |
| GET    | `/api/restaurants/:id`        | Restaurant details + full menu                  |
| POST   | `/api/orders`                 | Place a new order                               |
| GET    | `/api/orders`                 | List all past orders                            |
| GET    | `/api/orders/:id`              | Get a single order                              |

---

## Screenshots

_Add screenshots here once you run the app locally — recommended shots: home page with restaurant grid, restaurant menu page, cart, and checkout._

```
docs/screenshots/home.png
docs/screenshots/menu.png
docs/screenshots/cart.png
docs/screenshots/checkout.png
```

---

## Design decisions

- **Why a real backend instead of mock JSON?** The original project depended on an unofficial third-party proxy of a private API, which is unreliable and not something to depend on in a public repo. A small Express + SQLite backend is self-contained, has zero external dependencies, and demonstrates real API design and database schema work.
- **Why SQLite over MongoDB?** SQLite requires no separate database server — anyone cloning this repo can run it immediately with `npm install && npm run seed && npm run dev:server`. It's still a real relational database with real schema, foreign keys, and transactions.
- **Why the receipt/ticket visual motif?** The dashed dividers and monospace pricing are a deliberate nod to the food-ordering domain (a printed order ticket) rather than a generic card-based UI.

---

## Future improvements

- User authentication (sign up / log in) so order history is tied to an account rather than being global
- Real payment gateway integration (Razorpay/Stripe test mode)
- Restaurant owner/admin dashboard for managing menus
- Order status updates in real time (WebSocket or polling) instead of a static "placed" status
- Ratings and reviews from users
- Deployment with CI/CD (GitHub Actions) and a live demo link
- Automated tests (Vitest for frontend, Supertest for backend API)

---

## Author

**Vasavi Mandala**

- Email: [vasavimandala2004@gmail.com](mailto:vasavimandala2004@gmail.com)
- LinkedIn: [linkedin.com/in/vasavi-mandala-191264280](https://www.linkedin.com/in/vasavi-mandala-191264280)
- GitHub: [github.com/vasavi67](https://github.com/vasavi67)
