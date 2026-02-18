import { ZodSchema } from 'zod';
import { AppError } from '../utils/errors.js';

export const validate = (schema: ZodSchema) => {
  return (req: Express.Request, _res: Express.Response, next: Express.NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(new AppError('Validation failed', 400, result.error.flatten()));
    }

    req.body = result.data.body ?? req.body;
    req.params = result.data.params ?? req.params;
    req.query = result.data.query ?? req.query;
    next();
  };
};
