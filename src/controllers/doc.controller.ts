import { Request, Response } from "express";
import { getCollection } from "../config/db-collection";
import {
  BadRequestException,
  InternalServerError,
  UnprocessableEntityException,
} from "../exceptions/exceptions";
import { successResponse } from "../exceptions/responses";

import fs from "node:fs/promises";
import { JOBS } from "../enums/jobs";
import { cleanupQueue } from "../queues/cleanup.queue";
import { Collection, docService } from "../services/doc.service";
import { googleGenAiService } from "../services/google-genai.service";
import { sessionService } from "../services/session.service";

export class DocController {
  readDocument = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw BadRequestException("File is required");
    const filePath = req.file?.path;
    const oldSessionId = req.sessionID;

    req.session.regenerate(async (err) => {
      if (err) throw InternalServerError("Failed to regenerate session");

      const response = await docService.readDocument(file, req.sessionID);
      if (response.data.success === true) {
        await cleanupQueue.add(JOBS.IMMEDIATE_CLEANUP, {
          sessionId: oldSessionId,
        });

        req.session.documentName = file.originalname;
        req.session.chatHistory = [];

        req.session.chatHistory.push({
          role: "model",
          content:
            "Hello there!, I've read your document. Now you can ask me anything about your document.",
        });
        req.session.expiresAt = Date.now() + req.session.cookie.maxAge!;
        req.session.save((e) => {
          console.log("session saved", e);
        });
      }
      successResponse(res, response);
      if (filePath) fs.unlink(filePath).catch(console.error);
    });
  };

  chat = async (req: Request, res: Response) => {
    if (!req.session.chatHistory) throw BadRequestException("Session Expired");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    if (!req.body?.input)
      throw UnprocessableEntityException("Input is undefined!");

    const collection = await getCollection(Collection);
    const query = await collection.query({
      queryTexts: [req.body.input],
      where: { sessionId: req.sessionID },
    });
    const searchResults = query.documents.join(",");
    const stream = await googleGenAiService.generateStream(
      req.body.input,
      searchResults,
      req.session.chatHistory
    );

    let modelResponse = "";
    for await (const token of stream) {
      const chunkText = token.text || "";
      if (chunkText) {
        res.write(`data:${JSON.stringify({ content: chunkText })}\n\n`);
        modelResponse += chunkText;
      }
    }

    req.session.chatHistory?.push(
      { role: "user", content: req.body.input },
      {
        role: "model",
        content: modelResponse,
      }
    );

    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
      }
      res.write(`data: "[DONE]"\n\n`);
      res.end();
    });
  };

  getChatHistory = async (req: Request, res: Response) => {
    if (!req.session.chatHistory) throw BadRequestException("Session Expired");
    const chatHistory = req.session.chatHistory;
    successResponse(res, { data: { chatHistory } });
  };

  getSessionInfo = async (req: Request, res: Response) => {
    const response = await sessionService.getExpiresAt(req);
    successResponse(res, response);
  };

  deleteSession = async (req: Request, res: Response) => {
    const response = await sessionService.deleteSession(req, res);
    successResponse(res, response);
  };
}
