import { authService } from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/errors.js';
import type { NextFunction, Request, Response } from 'express';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const token = await authService.register(name, email, password, role);
      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      });
    } catch (error) {
      next(error);
    }
  }
};
