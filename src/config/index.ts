/**
 * node modules
 */
import dotenv from 'dotenv';

/**
 * types
 */
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue, //Ép kiểu sang định dạng chuỗi mà thư viện ms chấp nhận ('15m',...)
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: ['nvthai2904@gmail.com', 'pe909287g@gmail.com'],
  defaultResLimit: 20,
  defaultResOffset: 0,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};

export default config;
