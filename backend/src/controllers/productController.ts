import { productService } from '../services/productService.js';

export const productController = {
  async list(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const products = await productService.list(req.query as Record<string, string>);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
  async get(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const product = await productService.get(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
  async listByZone(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const products = await productService.listByZone(req.params.id);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
  async remove(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    try {
      await productService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
