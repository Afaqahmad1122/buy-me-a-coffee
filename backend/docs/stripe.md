# Stripe Integration Notes

## Endpoints

- `POST /api/donations/create-intent`  
  Body: `amount` (Number, USD), optional `name`, `message`, `customerId`, `paymentMethodId`, `savePaymentMethod`.

  - Without `paymentMethodId`, Stripe handles confirmation on client and, if `savePaymentMethod` is true, the intent is flagged for future off-session usage.
  - With `paymentMethodId`, the backend confirms immediately (`off_session`) and errors if additional authentication is required.

- `POST /api/stripe/setup-intent`  
  Body: `email` (required), `name` (optional).  
  Creates or reuses a Stripe customer, returns `clientSecret` for collecting and saving a card via `SetupIntent`.

- `GET /api/stripe/payment-methods?email=`  
  Returns all saved card fingerprints for the customer tied to the email. Response includes masking info and default indicator.

- `POST /api/stripe/webhook`  
  Consumes Stripe events (notably `payment_intent.succeeded`) and persists supporters.

## Recommended Manual Tests

1. Create donation with new card, ensure PaymentIntent succeeds and optional `savePaymentMethod` flag stores card for future use.
2. Call `POST /api/stripe/setup-intent`, confirm client can attach a card and `GET /api/stripe/payment-methods` reflects it.
3. Charge a saved card by sending `customerId` + `paymentMethodId` to `/create-intent`; verify it confirms server-side without client secret.
4. Hit webhook endpoint locally using Stripe CLI (`stripe listen --forward-to localhost:5000/api/stripe/webhook`) and ensure supporter record inserts.
