/**
 * node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * custom modules
 */
import { logger } from '@/lib/winston';
import { verifyAccessToken } from '@/lib/jwt';

/**
 * types
 */
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

/**
 * @function authenticate
 * @description Middleware để xác thực access token của người dùng từ header Authorization.
 *              Nếu token hợp lệ, ID của người dùng sẽ được gắn vào đối tượng request.
 *              Ngược lại, sẽ trả về phản hồi lỗi phù hợp.
 *
 * @param {Request} req - Đối tượng request của Express. Yêu cầu có token kiểu Bearer trong header Authorization.
 * @param {Response} res - Đối tượng response của Express, được dùng để trả lỗi nếu xác thực thất bại.
 * @param {NextFunction} next - Hàm next của Express để chuyển quyền điều khiển sang middleware tiếp theo.
 *
 * @returns {void}
 */

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }

  const [_, token] = authHeader.split(' ');

  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    //Gắn userId vào req để sử dụng sau này
    req.userId = jwtPayload.userId;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during authentication', error);
  }
};

export default authenticate;
