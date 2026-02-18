import { zoneRepository } from '../repositories/zoneRepository.js';
import { AppError } from '../utils/errors.js';

export const zoneService = {
  async list() {
    return zoneRepository.findAll();
  },
  async create(input: { name: string; position_x: number; position_y: number }) {
    return zoneRepository.create(input);
  },
  async update(id: string, input: { name?: string; position_x?: number; position_y?: number }) {
    const zone = await zoneRepository.findById(id);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    return zoneRepository.update(id, input);
  },
  async remove(id: string) {
    const zone = await zoneRepository.findById(id);
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    await zoneRepository.remove(id);
  }
};
