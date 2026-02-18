import { Router } from 'express';
import authRoutes from './authRoutes.js';
import zoneRoutes from './zoneRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/zones', zoneRoutes);
router.use('/products', productRoutes);

export default router;
