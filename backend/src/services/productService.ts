import {
  productRepository,
  ProductCreateInput,
  ProductFilters,
  ProductUpdateInput
} from '../repositories/productRepository.js';
import { zoneRepository } from '../repositories/zoneRepository.js';
import { AppError } from '../utils/errors.js';

export const productService = {
  async list(filters: ProductFilters) {
    return productRepository.findAll(filters);
  },
  async get(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },
  async listByZone(zoneId: string) {
    const zone = await zoneRepository.findById(zoneId);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    return productRepository.findByZoneId(zoneId);
  },
  async create(input: ProductCreateInput) {
    if (input.zone_id) {
      const zone = await zoneRepository.findById(input.zone_id);
      if (!zone) {
        throw new AppError('Assigned zone not found', 404);
      }
    }
    return productRepository.create(input);
  },
  async update(id: string, input: ProductUpdateInput) {
    if (input.zone_id) {
      const zone = await zoneRepository.findById(input.zone_id);
      if (!zone) {
        throw new AppError('Assigned zone not found', 404);
      }
    }
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return productRepository.update(id, input);
  },
  async remove(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    await productRepository.remove(id);
  }
};
