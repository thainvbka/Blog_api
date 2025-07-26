import { Router } from 'express';
const router = Router();

/**
 * routes
 */
import authRoutes from '@/routes/v1/auth';

//root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timstamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;
