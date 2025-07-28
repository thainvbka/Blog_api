/**
 * custom modules
 */
import { logger } from '@/lib/winston';

/**
 * models
 */
import User from '@/models/user';

/**
 * types
 */
import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // .select()	Chọn hoặc loại bỏ các trường cụ thể	Khi muốn tối ưu dữ liệu trả về
    // .lean()	Trả về object đơn giản, không phải Document	Khi chỉ cần đọc dữ liệu, không sửa đổi
    // .exec()	Thực thi query, trả về Promise thật	Khi dùng await hoặc cần stack trace rõ
    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while getting current user', error);
  }
};

export default getCurrentUser;
