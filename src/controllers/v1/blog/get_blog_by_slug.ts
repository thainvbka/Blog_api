/**
 * node modules
 */

/**
 * custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * models
 */
import Blog from '@/models/blog';
import User from '@/models/user';
/**
 * types
 */
import type { Request, Response } from 'express';

const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const userId = req.userId;

    const user = await User.findById(userId).select('role').lean().exec();

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (user?.role === 'user' && blog?.status === 'draft') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
      logger.warn('A user tried to access a draft blog', {
        userId,
        blog,
      });
      return;
    }

    res.status(200).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while getting blog by slug', error);
  }
};

export default getBlogBySlug;
