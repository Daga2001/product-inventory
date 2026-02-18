import { AppError } from '../utils/errors.js';

export const notFound = (_req: Express.Request, _res: Express.Response, next: Express.NextFunction) => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (
  err: unknown,
  _req: Express.Request,
  res: Express.Response,
  _next: Express.NextFunction
) => {
  const error = err instanceof AppError ? err : new AppError('Internal server error');
  res.status(error.statusCode).json({
    message: error.message,
    details: error.details ?? undefined
  });
};
