import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { Role } from '../types/index.js';

interface TokenPayload {
  sub: string;
  role: Role;
}

export const authenticate = (req: Express.Request, _res: Express.Response, next: Express.NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', 401));
  }

  const token = header.replace('Bearer ', '').trim();
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401, error));
  }
};

export const requireRole = (role: Role) => {
  return (req: Express.Request, _res: Express.Response, next: Express.NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }
    if (req.user.role !== role) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
};
