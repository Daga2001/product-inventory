import { zoneService } from '../services/zoneService.js';

export const zoneController = {
  async list(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const zones = await zoneService.list();
      res.json(zones);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const zone = await zoneService.create(req.body);
      res.status(201).json(zone);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const zone = await zoneService.update(req.params.id, req.body);
      res.json(zone);
    } catch (error) {
      next(error);
    }
  },
  async remove(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      await zoneService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
