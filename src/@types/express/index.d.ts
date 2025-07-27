/**
 * node modules
 */
import * as express from 'express';

/**
 * Types
 */
import type { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
