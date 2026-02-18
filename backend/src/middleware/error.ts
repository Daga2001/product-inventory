import { AppError } from '../utils/errors.js';
import type { NextFunction, Request, Response } from 'express';

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = err instanceof AppError ? err : new AppError('Internal server error');
  res.status(error.statusCode).json({
    message: error.message,
    details: error.details ?? undefined
  });
};
