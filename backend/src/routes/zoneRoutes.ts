import { Router } from 'express';
import { zoneController } from '../controllers/zoneController.js';
import { productController } from '../controllers/productController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { zoneCreateSchema, zoneUpdateSchema, zoneProductsSchema } from '../validation/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', zoneController.list);
router.post('/', requireRole('admin'), validate(zoneCreateSchema), zoneController.create);
router.put('/:id', requireRole('admin'), validate(zoneUpdateSchema), zoneController.update);
router.delete('/:id', requireRole('admin'), zoneController.remove);

router.get('/:id/products', validate(zoneProductsSchema), productController.listByZone);

export default router;
