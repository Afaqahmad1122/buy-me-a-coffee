import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import donationsRouter from "./routes/donation.js";
import stripeRouter from "./routes/stripe.js";
import supportersRouter from "./routes/supporters.js";

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    return next();
  }
  express.json()(req, res, next);
});
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/donations", donationsRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/supporters", supportersRouter);

// routes
app.get("/", (req, res) => {
  res.send("DOnation api up");
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
