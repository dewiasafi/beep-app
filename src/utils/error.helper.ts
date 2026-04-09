export interface BaseError {
  code: string;
  message: string;
  timestamp: Date;
}

export interface NotFoundError extends BaseError {
  path?: string;
}

export const validationError = (message: string): BaseError => ({
  code: "VALIDATION_ERROR",
  message,
  timestamp: new Date(),
});

export const notFoundError = (message: string): NotFoundError => ({
  code: "NOT_FOUND",
  message,
  timestamp: new Date(),
});

export const storageError = (message: string): BaseError => ({
  code: "STORAGE_ERROR",
  message,
  timestamp: new Date(),
});

export const authError = (message: string): BaseError => ({
  code: "AUTH_ERROR",
  message,
  timestamp: new Date(),
});
