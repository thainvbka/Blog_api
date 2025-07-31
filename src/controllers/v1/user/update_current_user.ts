/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * types
 */
import type { Request, Response } from 'express';

/**
 * models
 */
import User from '@/models/user';

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (!user.socialLink) {
      user.socialLink = {};
    }

    if (website) user.socialLink.website = website;
    if (facebook) user.socialLink.facebook = facebook;
    if (instagram) user.socialLink.instagram = instagram;
    if (linkedin) user.socialLink.linkedin = linkedin;
    if (x) user.socialLink.x = x;
    if (youtube) user.socialLink.youtube = youtube;

    await user.save();

    logger.info('User update successfully', user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while updating current user', error);
  }
};

export default updateCurrentUser;
