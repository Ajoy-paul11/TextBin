import express from "express";
import { createPaste, healthCheck, getPaste, getPasteHtml } from "./controller";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-test-now-ms"],
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());

app.get("/api/healthz", healthCheck);
app.post("/api/pastes", createPaste);
app.get("/api/pastes/:id", getPaste);
app.get("/p/:id", getPasteHtml);

const PORT = parseInt(process.env.PORT || "4000", 10);

app.get("/", (req, res) => res.send("OK"));

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});

export default app;
