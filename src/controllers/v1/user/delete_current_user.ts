/**
 * node modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * types
 */
import { Request, Response } from 'express';

/**
 * models
 */
import User from '@/models/user';
import Blog from '@/models/blog';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();
    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple blog banners deleted from cloudinary', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });

    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while deleting current user account', error);
  }
};

export default deleteCurrentUser;
