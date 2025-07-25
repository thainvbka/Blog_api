//node modules
import mongoose from 'mongoose';

//custom module
import config from '@/config';
import { logger } from '@/lib/winston';

//types
import type { ConnectOptions } from 'mongoose';

//client option

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error('Error connecting to the database', error);
  }
};

//disconects from the MongoDB database using Mongoose
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconected from the database successfully.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error('Error disconecting from the database', error);
  }
};
