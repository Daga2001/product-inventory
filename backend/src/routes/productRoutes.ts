import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { productCreateSchema, productUpdateSchema, productQuerySchema } from '../validation/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(productQuerySchema), productController.list);
router.get('/:id', productController.get);
router.post('/', requireRole('admin'), validate(productCreateSchema), productController.create);
router.put('/:id', requireRole('admin'), validate(productUpdateSchema), productController.update);
router.delete('/:id', requireRole('admin'), productController.remove);

export default router;
