import { CloudClient } from "chromadb";

import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import config from "./config";
const client = new CloudClient({
  apiKey: config.chromaApiKey,
  tenant: config.chromaTenant,
  database: config.chromaDB,
});

export const getCollection = async (collectionName: string) => {
  const collection = await client.getOrCreateCollection({
    name: collectionName,
    embeddingFunction: new GoogleGeminiEmbeddingFunction({
      apiKey: config.geminiApiKey,
      modelName: "gemini-embedding-001",
      dimension: 768,
    }),
  });
  return collection;
};

export const clearCollection = async (collectionName: string) => {
  await client.deleteCollection({
    name: collectionName,
  });
};
