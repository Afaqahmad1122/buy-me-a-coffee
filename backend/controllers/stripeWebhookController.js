import Stripe from "stripe";
import Supporter from "../models/Supporter.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      await Supporter.create({
        name: intent.metadata?.name || "Anonymous",
        amount: intent.amount,
        currency: intent.currency,
        message: intent.metadata?.message || "",
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
