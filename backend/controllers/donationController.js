import stripe from "../utils/stripe.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const {
      amount,
      name,
      message,
      customerId,
      paymentMethodId,
      savePaymentMethod,
    } = req.body;
    const currency = "usd";
    const amountInUsd = Number(amount);
    if (!amountInUsd || amountInUsd <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const amountInCents = Math.round(amountInUsd * 100);

    const paymentIntentPayload = {
      amount: amountInCents,
      currency,
      metadata: {
        name: name || "Anonymous",
        message: message || "",
      },
    };

    if (customerId) {
      paymentIntentPayload.customer = customerId;
    }

    if (paymentMethodId) {
      paymentIntentPayload.payment_method = paymentMethodId;
      paymentIntentPayload.confirm = true;
      paymentIntentPayload.off_session = true;
      paymentIntentPayload.error_on_requires_action = true;
    } else {
      paymentIntentPayload.automatic_payment_methods = { enabled: true };
      if (savePaymentMethod && customerId) {
        paymentIntentPayload.setup_future_usage = "off_session";
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(
      paymentIntentPayload
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};
