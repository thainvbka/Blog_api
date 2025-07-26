/**
 * node modules
 */
import winston, { error } from 'winston';

/**
 * custom modules
 */
import config from '@/config';
// ket hop nhieu formatter, them dau thoi gian, format output duoi dang JSON, log duoc stacktrace khi co loi, can chinh log dep hon, format log theo cu phap tu dinh nghia, them mau sac(dung cho console)
const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

//moi transport quyet dinh log se di dau (console, file, database)
const transports: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), //them mau cho log
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info', //muc log thap nhat duoc in (error, warn, info, debug,...)
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === 'test',
});

export { logger };
