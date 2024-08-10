import winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'log/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// transport.on('error', (error) => {
//   // log or handle errors here
// });

// transport.on('rotate', (oldFilename, newFilename) => {
//   // do something fun
// });

export const logger = winston.createLogger({
  transports: [
    transport,
  ],
});