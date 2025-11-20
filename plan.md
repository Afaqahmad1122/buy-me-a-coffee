# Donation Page (MERN + Stripe) Plan

## Project Goals

- Build a public landing page where visitors can donate any amount (one-off “Buy Me a Coffee” style).
- Practice Stripe Payment Intents, secure backend handling, and a clean React UI.
- Persist supporters in MongoDB and show a “Recent Supporters” list in real time.

## Tech Stack

- Frontend: React + Vite (or CRA), TypeScript, Tailwind (optional), Stripe.js.
- Backend: Node.js + Express, Stripe SDK, MongoDB via Mongoose.
- Infrastructure: `.env` for secrets, local dev via `npm run dev`, deployable to Render/Vercel + Mongo Atlas.

## High-Level Architecture

```
frontend/  → React SPA hits backend REST API
backend/   → Express API talks to Stripe + MongoDB
shared/    → (optional) types for donation payloads
```

## Backend (`backend/`)

1. **Setup**
   - Initialize `npm init`, install `express`, `cors`, `dotenv`, `stripe`, `mongoose`.
   - Folder structure: `src/index.ts`, `src/routes/donations.ts`, `src/models/Supporter.ts`, `src/services/stripe.ts`.
2. **Config**
   - Load `STRIPE_SECRET_KEY`, `CLIENT_URL`, `MONGODB_URI`.
3. **Stripe Integration**
   - Endpoint `POST /api/donations/create-intent`
     - Validate amount, currency.
     - Create PaymentIntent with metadata (name, message).
     - Return `clientSecret`.
   - Webhook `POST /api/stripe/webhook`
     - Verify signature.
     - On `payment_intent.succeeded`, persist supporter data (name, amount, message, timestamp, receipt URL).
4. **Supporter Data**
   - Mongoose schema: `{ name, amount, message, currency, createdAt }`.
   - Endpoint `GET /api/supporters?limit=10` sorted desc.
5. **Security & Testing**
   - CORS allow frontend origin.
   - Input validation (zod/joi).
   - Add Jest or basic supertest for endpoints (optional stretch).

## Frontend (`frontend/`)

1. **Setup**
   - Vite React TS, install `@stripe/stripe-js`, `@stripe/react-stripe-js`, `axios`, `zustand` (optional).
2. **UI Sections**
   - Hero with pitch + donation form.
   - Form fields: amount slider/input, name, optional message.
   - Recent supporters list component (auto-refresh or use SWR).
3. **Stripe Client Flow**
   - On submit:
     1. Call backend `/create-intent` with form data.
     2. Use Stripe Elements to confirm card payment with returned `clientSecret`.
     3. Show success state + supporter highlight.
4. **State & Validation**
   - Client-side validation for min/max amount.
   - Loading/error toasts.
5. **Supporters Feed**
   - Fetch `GET /supporters` on mount and every 30s (or use SSE/websocket stretch goal).
   - Display avatar initials, amount, relative time.

## Milestones

1. Scaffold repos + env setup.
2. Implement backend endpoints + webhook, test with Stripe CLI.
3. Build frontend UI + integrate Stripe checkout.
4. Connect supporters list + polish UX.
5. Deployment + final verification.

## Stretch Ideas

- Email receipt via SendGrid.
- Add goal progress bar.
- Admin dashboard/login to manage supporters.
