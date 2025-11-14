import { Request, Response } from "express";
import { successResponse } from "../exceptions/responses";

export class AppController {
  healthCheck = async (_req: Request, res: Response) => {
    const response = {
      data: {
        uptime: process.uptime(),
      },
    };
    successResponse(res, response);
  };
}
