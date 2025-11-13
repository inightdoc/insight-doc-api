import { Queue } from "bullmq";
import config from "../config/config";

export const cleanupQueue = new Queue("cleanup", {
  connection: {
    username: config.redisUsername,
    password: config.redisPassword,
    host: config.redisHost,
    port: config.redisPort,
  },
});
