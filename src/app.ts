import cors from "cors";
import express from "express";
import session from "express-session";
import fs from "node:fs/promises";
import path from "node:path";
import { ChatHistory } from "src/types/chat";
import config from "./config/config";
import redisClient from "./config/redis-client";
import { sessionOptions } from "./config/redis-config";
import { globalErrorHandler } from "./middleware/global-error-handler.middleware";
import docRoute from "./routes/doc.route";

declare module "express-session" {
  interface SessionData {
    sessionID?: string;
    documentName?: string;
    chatHistory?: ChatHistory[];
    expiresAt?: number;
  }
}
const uploadsPath = path.join(process.cwd(), "uploads");
const makeUploadsDirectory = async () => {
  try {
    await fs.mkdir(uploadsPath, { recursive: true });
    console.log("✅ Uploads folder created");
  } catch (err) {
    console.error("❌ Failed to create uploads folder", err);
  }
};

const app = express();
redisClient.connect();
const allowedOrigins = [config.corsOrigin];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  if (req.url.substring(0, 4) === "/api") {
    req.url = req.url.substring(4);
  }
  next();
});
app.use(session(sessionOptions));
makeUploadsDirectory();

app.use("/", docRoute);
app.use(globalErrorHandler);

export default app;
