import { zoneService } from '../services/zoneService.js';
import { AppError } from '../utils/errors.js';
import type { NextFunction, Request, Response } from 'express';

export const zoneController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const zones = await zoneService.list(req.user.id);
      res.json(zones);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const zone = await zoneService.create(req.user.id, req.body);
      res.status(201).json(zone);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const zone = await zoneService.update(req.user.id, req.params.id, req.body);
      res.json(zone);
    } catch (error) {
      next(error);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      await zoneService.remove(req.user.id, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
