# pos - system

A local point-of-sale application for a phone shop, built with a React/Vite client and an Express/MongoDB backend.

## Project structure

- `client/` — React + Vite front-end
- `server/` — Express API, MongoDB/Mongoose data layer, JWT auth

## Main features

- Role-based authentication and protected routes
- Retail POS sales workflow with cart, discounts, payments, and receipts
- Inventory management with stock adjustments
- Sales listing and refund support
- Repair order tracking and dashboard metrics

## Tech stack

- Frontend: React, Redux Toolkit, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, MongoDB
- Dev tools: Axios, ESLint, Nodemon

## Local setup

### 1. Start the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` with at least:

```env
MONGO_URI=mongodb://localhost:27017/phone-shop-pos
PORT=5000
```

Seed the admin user (optional but useful for first login):

```bash
npm run seed
```

Run the server:

```bash
npm run dev
```

### 2. Start the frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open the client URL printed by Vite, typically `http://localhost:5173`.

## Default seed credentials

If you run `npm run seed` from `server/`, a default admin user is created:

- `userId`: `ADM-001`
- `password`: `admin123`

> Change the password immediately after first login.

## Notes

- The front-end API base URL is configured in `client/src/api/axiosInstance.js` as `http://localhost:5000/api`.
- Local MongoDB may not support replica-set transactions; the backend detects this and runs without unsupported transaction behavior.
- If you need to point the app at a different MongoDB instance, update `server/.env` accordingly.
