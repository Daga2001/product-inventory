import { zoneRepository } from '../repositories/zoneRepository.js';
import { AppError } from '../utils/errors.js';

export const zoneService = {
  async list(userId: string) {
    return zoneRepository.findAll(userId);
  },
  async create(userId: string, input: { name: string; position_x: number; position_y: number }) {
    return zoneRepository.create(userId, input);
  },
  async update(userId: string, id: string, input: { name?: string; position_x?: number; position_y?: number }) {
    const zone = await zoneRepository.findById(userId, id);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    return zoneRepository.update(userId, id, input);
  },
  async remove(userId: string, id: string) {
    const zone = await zoneRepository.findById(userId, id);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    await zoneRepository.remove(userId, id);
  }
};
