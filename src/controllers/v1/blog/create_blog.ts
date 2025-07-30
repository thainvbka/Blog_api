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
/**
 * types
 */
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

/**
 * purify the blog content
 */
const window = new JSDOM('').window;
const purify = DOMpurify(window);

const createBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, content, banner, status } = req.body as BlogData;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info('New blog created', newBlog);

    res.status(201).json({
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during blog creating', error);
  }
};

export default createBlog;
