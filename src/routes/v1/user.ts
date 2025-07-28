/**
 * node modules
 */
import { Router } from 'express';
import { param, query, body } from 'express-validator';

/**
 * middlewares
 */
import validationError from '@/middlewares/validationError';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';

/**
 * models
 */
import User from '@/models/user';

/**
 * controllers
 */
import getCurrentUser from '@/controllers/v1/user/get_current_user';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

export default router;
