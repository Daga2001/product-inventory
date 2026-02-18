import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/errors.js';
import { Role } from '../types/index.js';

export const authService = {
  async register(name: string, email: string, password: string, role: Role = 'user') {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password_hash, role });
    return this.signToken(user.id, user.role);
  },
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }
    return this.signToken(user.id, user.role);
  },
  signToken(userId: string, role: Role) {
    return jwt.sign({ sub: userId, role }, env.jwtSecret, { expiresIn: '12h' });
  }
};
