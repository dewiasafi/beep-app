import type { Response } from "express";

interface Success<T> {
  res: Response;
  data?: T;
  message?: string;

  total?: number;
  page?: number;
  limit?: number;
}

export const successResponse = <T>(options: Success<T>) => {
  const { res, data, message, total, page, limit } = options;

  const response: any = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  if (total !== undefined) {
    response.total = total;
  }

  if (page !== undefined) {
    response.page = page;
  }

  if (limit !== undefined) {
    response.limit = limit;
  }

  return res.status(200).json(response);
};

export const successCreated = <T>(res: Response, data: T) => {
  return res.status(201).json({
    success: true,
    data,
  });
};

export const badRequest = (res: Response, message: string, detail?: any) => {
  return res.status(400).json({
    success: false,
    error: { code: "BAD_REQUEST", message, ...(detail && { detail }) },
  });
};

export const notFound = (res: Response, message: string) => {
  return res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message },
  });
};

export const internalError = (
  res: Response,
  message: string = "Internal server error",
) => {
  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message },
  });
};
