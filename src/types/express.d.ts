// types/express.d.ts (buat file ini)
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedBody?: unknown;
      validatedParams?: unknown;
    }
  }
}

export {};