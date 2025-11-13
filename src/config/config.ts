import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  geminiApiKey: string;
  redisSecret: string;
  redisUsername: string;
  redisPassword: string;
  redisPort: number;
  redisHost: string;
  chromaDB: string;
  chromaApiKey: string;
  chromaTenant: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  redisSecret: process.env.REDIS_SECRET || "",
  redisUsername: process.env.REDIS_USERNAME || "",
  redisPassword: process.env.REDIS_PASSWORD || "",
  redisHost: process.env.REDIS_HOST || "",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  chromaDB: process.env.CHROMA_DB || "",
  chromaApiKey: process.env.CHROMA_API_KEY || "",
  chromaTenant: process.env.CHROMA_TENANT || "",
};

export default config;
