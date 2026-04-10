import type { NextFunction, Request, Response } from "express";
import z from "zod";

type AnyZodObject = z.ZodObject<z.ZodRawShape>;

const handleError = (error: unknown, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    const firstError = error.issues[0]!;
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: firstError.message,
        field: firstError.path.join("."),
      },
    });
  } else {
    next(error);
  }
};

export const validateBody = <T extends AnyZodObject>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      handleError(error, res, next);
    }
  };
};

export const validateParams = <T extends AnyZodObject>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      req.validatedParams = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      handleError(error, res, next);
    }
  };
};

export const validateQuery = <T extends AnyZodObject>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
     try {
          req.validatedQuery = await schema.parseAsync(req.query)
          next()
     } catch (error) {
          handleError(error, res, next)
     }
  };
};
