import { zoneService } from '../services/zoneService.js';
import { AppError } from '../utils/errors.js';

export const zoneController = {
  async list(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
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
  async create(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
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
  async update(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
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
  async remove(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
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
