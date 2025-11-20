import stripe from "../utils/stripe.js";
import Donor from "../models/Donor.js";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const createSetupIntent = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = normalizeEmail(email);

    let donor = await Donor.findOne({ email: normalizedEmail });

    if (!donor) {
      const customer = await stripe.customers.create({
        email: normalizedEmail,
        name,
      });

      donor = await Donor.create({
        email: normalizedEmail,
        name: name || "",
        stripeCustomerId: customer.id,
      });
    } else if (!donor.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: normalizedEmail,
        name: name || donor.name,
      });
      donor.stripeCustomerId = customer.id;
      if (name) {
        donor.name = name;
      }
      await donor.save();
    } else if (name && donor.name !== name) {
      donor.name = name;
      await donor.save();
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: donor.stripeCustomerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      customerId: donor.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error creating setup intent", error);
    res.status(500).json({ error: "Failed to create setup intent" });
  }
};

export const listSavedPaymentMethods = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const donor = await Donor.findOne({ email: normalizedEmail });

    if (!donor || !donor.stripeCustomerId) {
      return res.json({ paymentMethods: [], customerId: null });
    }

    const [customer, paymentMethods] = await Promise.all([
      stripe.customers.retrieve(donor.stripeCustomerId, {
        expand: ["invoice_settings.default_payment_method"],
      }),
      stripe.paymentMethods.list({
        customer: donor.stripeCustomerId,
        type: "card",
      }),
    ]);

    if (customer.deleted) {
      donor.stripeCustomerId = undefined;
      await donor.save();
      return res.json({ paymentMethods: [], customerId: null });
    }

    const defaultPaymentMethodId =
      typeof customer.invoice_settings?.default_payment_method === "string"
        ? customer.invoice_settings.default_payment_method
        : customer.invoice_settings?.default_payment_method?.id;

    const sanitized = paymentMethods.data.map((paymentMethod) => ({
      id: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      isDefault: paymentMethod.id === defaultPaymentMethodId,
    }));

    res.json({
      paymentMethods: sanitized,
      customerId: donor.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error listing saved payment methods", error);
    res.status(500).json({ error: "Failed to fetch saved cards" });
  }
};
