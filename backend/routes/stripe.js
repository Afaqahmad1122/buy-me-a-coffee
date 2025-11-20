import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhookController.js";
import {
  createSetupIntent,
  listSavedPaymentMethods,
} from "../controllers/cardController.js";

const router = express.Router();

router.post("/webhook", handleStripeWebhook);
router.post("/setup-intent", createSetupIntent);
router.get("/payment-methods", listSavedPaymentMethods);

export default router;
