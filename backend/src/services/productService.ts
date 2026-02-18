import {
  productRepository,
  ProductCreateInput,
  ProductFilters,
  ProductUpdateInput
} from '../repositories/productRepository.js';
import { zoneRepository } from '../repositories/zoneRepository.js';
import { AppError } from '../utils/errors.js';

export const productService = {
  async list(userId: string, filters: ProductFilters) {
    return productRepository.findAll(userId, filters);
  },
  async get(userId: string, id: string) {
    const product = await productRepository.findById(userId, id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },
  async listByZone(userId: string, zoneId: string) {
    const zone = await zoneRepository.findById(userId, zoneId);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    return productRepository.findByZoneId(userId, zoneId);
  },
  async create(userId: string, input: ProductCreateInput) {
    if (input.zone_id) {
      const zone = await zoneRepository.findById(userId, input.zone_id);
      if (!zone) {
        throw new AppError('Assigned zone not found', 404);
      }
    }
    return productRepository.create(userId, input);
  },
  async update(userId: string, id: string, input: ProductUpdateInput) {
    if (input.zone_id) {
      const zone = await zoneRepository.findById(userId, input.zone_id);
      if (!zone) {
        throw new AppError('Assigned zone not found', 404);
      }
    }
    const product = await productRepository.findById(userId, id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return productRepository.update(userId, id, input);
  },
  async remove(userId: string, id: string) {
    const product = await productRepository.findById(userId, id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    await productRepository.remove(userId, id);
  }
};
