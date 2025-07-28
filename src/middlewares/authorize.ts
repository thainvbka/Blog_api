/**
 * node modules
 */

/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * types
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * models
 */
import User from '@/models/user';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
      }

      return next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: error,
      });

      logger.error('Error while authorizing user', error);
    }
  };
};

export default authorize;
