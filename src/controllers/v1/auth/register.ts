/**
 * custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';
import { genUsername } from '@/utils';

/**
 * model
 */
import User from '@/models/user';
import Token from '@/models/token';
/**
 * types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You can not register as an admin',
    });

    logger.warn(
      `User with email ${email} tried to register as an admin but is not in the whitelist`,
    );
    return;
  }

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    //generate access token and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    //luu tru refresh token in db
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
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
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user registration', error);
  }
};

export default register;
