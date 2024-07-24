import winston, { createLogger, transports, format } from 'winston';
import { EnvTypes } from '../types';

const { timestamp, combine, printf } = format;

export interface ILogger {
  setEnv: (env: EnvTypes) => void;
  setVerbose: (isVerbose: boolean) => void;

  info: (message: string, ...optionalParams: unknown[]) => void;
  error: (message: string, ...optionalParams: unknown[]) => void;
}

/**
 * A custom logger with winstonJS
 *
 * @class
 *
 * @private @property {boolean} isVerbose - default is false
 * @private @property {EnvTypes|undefined} env - default is undefined
 * @private @property {winston.Logger} logger - winston logger instance
 * @private @method loggerCreate - creates an instance of winston logger
 *
 * @method setEnv - env setter
 * @param {EnvTypes} env
 *
 * @method setVerbose - verbose setter
 * @param {boolean} isVerbose
 *
 * @method info - info logger
 * @param {string} message
 * @param {unknown[]} optionalParams
 *
 * @method error - error logger
 * @param {string} message
 * @param {unknown[]} optionalParams
 */

class Logger implements ILogger {
  private isVerbose: boolean;
  private env?: EnvTypes | undefined;
  private logger: winston.Logger;

  constructor() {
    this.isVerbose = false;
    this.logger = this.loggerCreate();
  }

  /**
   * create winston logger instance
   *
   * @returns {winston.Logger}
   */
  private loggerCreate(): winston.Logger {
    const myFormat = printf(({ level, message, timestamp }) => {
      return `${this.env} ${level}: ${message} | timestamp: ${timestamp}`;
    });

    const logger = createLogger({
      level: 'info',
      format: combine(timestamp(), myFormat),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: './logs/combine.log',
          level: 'info',
        }),
        new transports.File({
          filename: './logs/error.log',
          level: 'error',
        }),
      ],
    });

    return logger;
  }

  /**
   * ENV setter
   *
   * @param {EnvTypes} env
   */
  setEnv(env: EnvTypes) {
    this.env = env;
  }

  /**
   * Verbose setter
   *
   * @param {boolean} isVerbose
   */
  setVerbose(isVerbose: boolean) {
    this.isVerbose = isVerbose;
  }

  /**
   * error logger
   *
   * @param {string} message
   * @param {unknown[]} optionalParams
   */
  error(message: string, ...optionalParams: unknown[]) {
    if (this.isVerbose) {
      this.logger.error(message + ' ' + optionalParams);
    } else {
      this.logger.error(message);
    }
  }

  /**
   * info logger
   *
   * @param {string} message
   * @param {unknown[]} optionalParams
   */
  info(message: string, ...optionalParams: unknown[]) {
    if (this.isVerbose) {
      this.logger.info(message + ' ' + optionalParams);
    } else {
      this.logger.info(message);
    }
  }
}

export default Logger;
