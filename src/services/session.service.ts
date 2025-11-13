import { Request, Response } from "express";
import { JOBS } from "../enums/jobs";
import {
  BadRequestException,
  NotFoundException,
} from "../exceptions/exceptions";
import { cleanupQueue } from "../queues/cleanup.queue";

class SessionService {
  async getExpiresAt(req: Request) {
    if (!req.session?.expiresAt) throw NotFoundException("Session not found");

    const expiresAt = req.session.expiresAt;
    return {
      data: { expiresAt },
    };
  }

  async deleteSession(req: Request, res: Response) {
    if (!req.sessionID) {
      throw BadRequestException("Session not found");
    }
    const sessionId = req.sessionID;

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    await cleanupQueue.add(JOBS.IMMEDIATE_CLEANUP, {
      sessionId,
    });

    res.clearCookie("connect.sid");

    return { data: { success: true } };
  }
}
export const sessionService = new SessionService();
