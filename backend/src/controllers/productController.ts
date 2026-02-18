import { productService } from '../services/productService.js';
import { AppError } from '../utils/errors.js';
import type { NextFunction, Request, Response } from 'express';

export const productController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const products = await productService.list(req.user.id, req.query as Record<string, string>);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const product = await productService.get(req.user.id, req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
  async listByZone(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const products = await productService.listByZone(req.user.id, req.params.id);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const product = await productService.create(req.user.id, req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const product = await productService.update(req.user.id, req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      await productService.remove(req.user.id, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
