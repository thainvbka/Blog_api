import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

//custom modules
import config from '@/config';
import limiter from '@/lib/express.rate_limit';
import { connectToDatabase, disconectFromDatabase } from '@/lib/mongoose';

//router
import v1Routes from '@/routes/v1';

//types
import type { CorsOptions } from 'cors';

const app = express();

//configure cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

app.use(cors(corsOptions));

//enable json request body parsing
app.use(express.json());

//enable URL-encoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, //only compress response larger than 1kb
  }),
);

//use helmet to enhance security by settings various HTTP headers
app.use(helmet());

//apply rate limiting middleware to prevent exessive requests and ehance security
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log('Failed to start the server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();
//xử lý tắt server một cách an toàn khi ứng dụng nhận tín hiệu dừng như SIGINT (Ctrl+C) hoặc SIGTERM (do hệ thống gửi, ví dụ Heroku hoặc Docker khi scale down).
const handleServerShutdown = async () => {
  try {
    await disconectFromDatabase();
    console.log('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown', error);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
