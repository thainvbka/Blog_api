/**
 * node modules
 */
import DOMpurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * custom modules
 */
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
import type { IBlog } from '@/models/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

/**
 * purify the blog content
 */
const window = new JSDOM('').window;
const purify = DOMpurify(window);

const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.userId;
    const { title, content, banner, status } = req.body as BlogData;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
      logger.warn('A user tried to updated a blog without permission', {
        userId,
        blog,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    logger.info('Blog update', { blog });

    res.status(201).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during blog updating', error);
  }
};

export default updateBlog;
