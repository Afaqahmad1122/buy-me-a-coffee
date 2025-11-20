import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: "" },
    stripeCustomerId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
