import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status, statusCode, message } = err;
  res.status(statusCode || 500).json({
    success: false,
    status: status || "error",
    statusCode: statusCode || 500,
    message,
  });
};
