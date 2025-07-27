/**
 * custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }
    //generate access token and refresh token for new user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //luu tru refresh token in db
    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info('Refresh token created for user', {
      userId: user._id,
      refreshToken,
    });

    //gửi Refresh Token về client thông qua cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, //Không cho JavaScript phía client truy cập cookie giúp chống XSS (Cross-site scripting).
      secure: config.NODE_ENV === 'production', //Chỉ cho gửi cookie qua HTTPS nếu đang chạy môi trường production
      sameSite: 'strict', //Cookie chỉ được gửi khi request cùng domain, chống CSRF.
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    logger.info('User login success', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user registration', error);
  }
};

export default login;
