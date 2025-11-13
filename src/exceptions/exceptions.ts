import createHttpError from "http-errors";
import { HTTP_STATUS_CODE } from "../enums/http-status-codes";

export function NotFoundException(message = "Not Found") {
  throw createHttpError(HTTP_STATUS_CODE.NOT_FOUND, message);
}

export function ForbiddenException(message = "Forbidden") {
  throw createHttpError(HTTP_STATUS_CODE.FORBIDDEN, message);
}

export function UnprocessableEntityException(message = "Unprocessable Entity") {
  throw createHttpError(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY, message);
}

export function UnauthorizedException(message = "Unauthorized") {
  throw createHttpError(HTTP_STATUS_CODE.UNAUTHORIZED, message);
}

export function BadRequestException(message = "Bad Request") {
  throw createHttpError(HTTP_STATUS_CODE.BAD_REQUEST, message);
}

export function InternalServerError(message = "Internal Server Error") {
  throw createHttpError(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, message);
}
