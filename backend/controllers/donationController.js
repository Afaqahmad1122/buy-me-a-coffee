import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", name, message } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        name: name || "Anonymous",
        message: message || "",
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};
