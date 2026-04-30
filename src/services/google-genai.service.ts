import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { ChatHistory } from "src/types/chat";
import config from "../config/config";

class GoogleGenAiService {
  client!: GoogleGenAI;
  constructor() {
    this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  genAi() {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
    return this.client;
  }

  async generateResponse(userQuery: string, searchResults: string) {
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const promptTemplate = `SYSTEM INSTRUCTIONS:
        You are an intelligent, helpful, and informative assistant.
        Your task is to answer the user's question *ONLY* using the text provided in the "REFERENCE PASSAGES" section.
        - Be comprehensive and include all relevant details from the passages.
        - If the passages do not contain the answer, you must state clearly: "I cannot find the answer in the provided documents." Do not use your general knowledge.
        - Do not repeat or use the instruction block as part of your answer.

        ---
        REFERENCE PASSAGES:
        ${searchResults}
        ---
        USER QUESTION:
        ${userQuery}
        ---
        ANSWER:`;
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptTemplate,
      config: {
        safetySettings: safetySettings,
      },
    });
    return response.text;
  }

  async generateStream(
    userQuery: string,
    searchResults: string,
    chatHistory: ChatHistory[],
  ) {
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const promptTemplate = `SYSTEM INSTRUCTIONS:
        You are an intelligent, helpful, and informative assistant.
        Your task is to answer the user's question *ONLY* using the text provided in the "REFERENCE PASSAGES" section.
        User asks the question based only on one document which they uploaded.
        - Respond in a conversational manner
        - Be comprehensive and include all relevant details from the passages.
        - If the passages do not contain the answer, you must state clearly: "I cannot find the answer in the provided document." Do not use your general knowledge.
        - Do not repeat or use the instruction block as part of your answer.
        - Response must be well formatted and spaced preferably in markdown format.

        ---
        REFERENCE PASSAGES:
        ${searchResults}
        ---
        USER QUESTION:
        ${userQuery}

        
        ---
        ANSWER:`;
    const stream = await this.client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: promptTemplate,
      config: {
        safetySettings: safetySettings,
      },
    });
    return stream;
  }
}
export const googleGenAiService = new GoogleGenAiService();
