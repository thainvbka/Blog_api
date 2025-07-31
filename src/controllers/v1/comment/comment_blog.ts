/**
 * Node modules
 */
import DomPurify from 'dompurify';
import { JSDOM } from 'jsdom';
/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * models
 */
import Blog from '@/models/blog';
import Comment from '@/models/comment';
/**
 * types
 */
import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

/**
 * Purify the comment content
 */
const window = new JSDOM('').window;
const purify = DomPurify(window);

const commentBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { content } = req.body as CommentData;
  const userId = req.userId;
  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });

    logger.info('New comment create', newComment);

    blog.commentsCount++;

    await blog.save();

    logger.info('Blog comments count update', {
      userId,
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.status(200).json({
      commentsCount: blog.commentsCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during commenting in blog', error);
  }
};

export default commentBlog;
