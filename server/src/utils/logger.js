import winston from "winston";
import util from "node:util";

const {
  combine,
  timestamp,
  printf,
  colorize,
} = winston.format;

const logFormat = printf(
  ({ level, message, timestamp, ...meta }) => {
    const metadata =
      Object.keys(meta).length
        ? util.inspect(meta, {
            depth: 4,
            breakLength: Infinity,
            compact: true,
          })
        : "";

    return `${timestamp}[${level}]:${message} ${metadata}`;
  }
);

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
      ),
    }),
  ],
});