// middlewares/logger.js

const winston = require('winston');
const expressWinston = require('express-winston');

// The winston.format function allows us to customize how our logs 
// are formatted. In this case, we are using a built-in timestamp
// format, as well as Winston's generic printf method.
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack || message}`
  )
);

// The request logger, with two different "transports". One transport
// logs to a file, the other logs to the console.
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      // For console logs we use our relatively concise messageFormat
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      // For file logs we use the more verbose json format
      format: winston.format.json(),
    }),
  ],
});

// error logger
const errorLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        format: messageFormat,
      }),
      new winston.transports.File({
        filename: "error.log",
        format: winston.format.json(),
      }),
    ],
  });

  module.exports = {
    requestLogger,
    errorLogger,
  };