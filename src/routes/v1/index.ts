import { Router } from 'express';
const router = Router();

//root route

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timstamp: new Date().toISOString(),
  });
});

export default router;
