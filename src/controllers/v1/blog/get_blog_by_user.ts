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

interface QueryType {
  status?: 'draft' | 'published';
}

const getBlogByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const currentUser = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();
    const query: QueryType = {};

    //chi hien thi blog published cho user
    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments({ author: userId, ...query });

    const blogs = await Blog.find({ author: userId, ...query })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while getting blogs by user', error);
  }
};

export default getBlogByUser;
