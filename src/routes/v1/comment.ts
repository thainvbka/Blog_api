/**
 * node modules
 */
import { Router } from 'express';
import { body, param } from 'express-validator';

/**
 * custom modules
 */

/**
 * middleswares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

/**
 * controllers
 */
import commentBlog from '@/controllers/v1/comment/comment_blog';
const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

export default router;
