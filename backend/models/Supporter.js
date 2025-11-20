import mongoose from "mongoose";

const supporterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    message: { type: String, default: "" },
    paymentIntentId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Supporter", supporterSchema);
