import express from "express";
import {
  createPaymentIntent,
  recordDonation,
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/create-intent", createPaymentIntent);
router.post("/record", recordDonation);

export default router;
