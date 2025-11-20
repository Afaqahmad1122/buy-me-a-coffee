import stripe from "../utils/stripe.js";
import Supporter from "../models/Supporter.js";

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
      await Supporter.findOneAndUpdate(
        { paymentIntentId: intent.id },
        {
          name: intent.metadata?.name || "Anonymous",
          amount: intent.amount / 100,
          currency: intent.currency,
          message: intent.metadata?.message || "",
          paymentIntentId: intent.id,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
