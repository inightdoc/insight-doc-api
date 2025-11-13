import { createClient } from "redis";
import config from "./config";

const redisClient = createClient({
  username: config.redisUsername,
  password: config.redisPassword,
  socket: {
    host: config.redisHost,
    port: config.redisPort,
  },
});

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;
