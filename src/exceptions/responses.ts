import { Response } from "express";
import { HTTP_STATUS_CODE } from "../enums/http-status-codes";
import { RESPONSE_MESSAGES } from "../enums/response-messages";

export function successResponse(
  res: Response,
  data: any,
  message = RESPONSE_MESSAGES.SUCCESS
) {
  const responseBody = {
    success: true,
    message,
    ...data,
  };

  res.status(HTTP_STATUS_CODE.SUCCESS).json(responseBody);
}
