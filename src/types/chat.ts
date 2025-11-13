export interface UploadResponse {
  success: boolean;
}
export interface ChatHistory {
  role: "user" | "model";
  content: string;
}

export interface ChatHistoryResponse {
  chatHistory: ChatHistory[];
}

export interface SessionInfoResponse {
  expiresAt: number;
}
