import { RedisStore } from "connect-redis";
/// <reference path="/src/types/express-session.d.ts" />
import session from "express-session";
import config from "./config";
import redisClient from "./redis-client";

export const sessionOptions: session.SessionOptions = {
  store: new RedisStore({ client: redisClient }),
  secret: config.redisSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
  }, // 1 hour
};
