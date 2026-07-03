# Food Ordering App

A full-stack food-delivery marketplace. Customers search restaurants by city, order through Stripe Checkout, and track their order status live; restaurant owners manage their restaurant, menu, and incoming orders from a dashboard.

## Features

**For customers**
- Search restaurants by city, filter by cuisine, sort results, paginate
- Restaurant detail page with menu, cart, and delivery pricing
- Stripe Checkout payment; order confirmation via Stripe webhook
- Order status page that polls live order progress (placed → paid → in progress → out for delivery → delivered)
- Reviews: rate a restaurant, see other reviews; owners can reply
- Profile management (delivery address details)

**For restaurant owners**
- Create and update a restaurant (name, city, delivery price, estimated time, cuisines, menu items, image upload to Cloudinary)
- Order dashboard: view incoming orders and update their status
- Reply to customer reviews

**Auth** is handled end-to-end by Auth0 (SPA login on the client, JWT validation on the API).

## Tech stack

| Layer | Technologies |
|---|---|
| Client | React 18, TypeScript, Vite, React Router 6, React Query, react-hook-form + Zod, Tailwind CSS + shadcn/ui (Radix), Auth0 React SDK, sonner |
| Server | Node.js, Express 4, TypeScript, Mongoose (MongoDB), express-oauth2-jwt-bearer (Auth0), Stripe, Cloudinary + Multer, express-validator |
| Tooling | pnpm, nodemon, Stripe CLI (webhook forwarding), ts-node seed scripts |

## Project structure

```
food-ordering-app/
├── client/                 # React SPA (Vite, port 5173)
│   └── src/
│       ├── pages/          # Home, Search, Detail, OrderStatus, UserProfile, ManageRestaurant, AuthCallback
│       ├── forms/          # user-profile-form, manage-restaurant-form
│       ├── api/            # React Query hooks per resource
│       ├── components/     # UI + shadcn components
│       └── auth/           # Auth0 provider & protected routes
└── server/                 # Express API (port 8000)
    └── src/
        ├── controller/     # user, restaurant, myRestaurant, order, review
        ├── router/         # /api/v1/{user,restaurant,my/restaurant,order}
        ├── model/          # User, Restaurant, Order, Review
        └── middleware/     # Auth0 JWT check/parse, express-validator rules
```

## Getting started

### Prerequisites

- Node.js + [pnpm](https://pnpm.io)
- MongoDB database (e.g. Atlas)
- [Auth0](https://auth0.com) application (SPA) + API audience
- [Stripe](https://stripe.com) account + [Stripe CLI](https://stripe.com/docs/stripe-cli) for local webhooks
- [Cloudinary](https://cloudinary.com) account for restaurant images

### 1. Configure environment

Copy the examples and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Server (`server/.env`): `MONGO_URI`, `PORT`, `AUTH0_AUDIENCE`, `AUTH0_ISSUER_BASE_URL`, `CLOUDINARY_*`, `FRONTEND_URL`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`.

Client (`client/.env`): `VITE_API_BASE_URL` (default `http://localhost:8000/api/v1`), `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_CALLBACK_URL`, `VITE_AUTH0_AUDIENCE`.

### 2. Run in development

```bash
# Terminal 1 — API on :8000 (also runs `stripe listen`, forwarding
# webhooks to /api/v1/order/checkout/webhook)
cd server && pnpm install && pnpm serve

# Terminal 2 — client on :5173
cd client && pnpm install && pnpm dev
```

### 3. Seed sample data (optional)

```bash
cd server
pnpm seed           # restaurants
pnpm seed:reviews   # reviews
```

### Production build

```bash
cd server && pnpm build && pnpm start   # compiles to dist/ and runs it
cd client && pnpm build                 # static build in dist/
```

## API overview

Base path: `/api/v1`. Routes marked 🔒 require an Auth0 access token. There is also a public `GET /health` check.

| Method | Route | Description |
|---|---|---|
| GET/POST/PUT 🔒 | `/user` | Get / create / update the current user |
| GET | `/restaurant/search/:city` | Search restaurants (cuisine filter, sort, pagination via query params) |
| GET | `/restaurant/:restaurantId` | Restaurant details |
| GET | `/restaurant/:restaurantId/reviews` | List reviews |
| POST 🔒 | `/restaurant/:restaurantId/reviews` | Create a review |
| GET 🔒 | `/restaurant/:restaurantId/reviews/me` | Current user's review status |
| POST 🔒 | `/restaurant/reviews/:reviewId/reply` | Owner reply to a review |
| GET/POST/PUT 🔒 | `/my/restaurant` | Get / create / update own restaurant (multipart image upload) |
| GET 🔒 | `/my/restaurant/order` | Orders for own restaurant |
| PATCH 🔒 | `/my/restaurant/order/:orderId/status` | Update order status |
| GET 🔒 | `/order` | Current user's orders |
| POST 🔒 | `/order/checkout/create-checkout-session` | Start Stripe Checkout |
| POST | `/order/checkout/webhook` | Stripe webhook (raw body, signature-verified) |
