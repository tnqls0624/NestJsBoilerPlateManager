import {LoggerService} from '@nestjs/common';
import {logger, createLogger} from './winstonLogger';

export default class AppLogger implements LoggerService {
  constructor() {
    createLogger();
  }

  // error(message: any, ...optionalParams: any[]) {
  error(message: string, stack?: string, context?: string) {
    logger.error(message, {from: context, stack});
  }

  // warn(message: any, ...optionalParams: any[]) {
  warn(message: string, context?: string) {
    logger.warn(message, {from: context});
  }

  log(message: string, context?: string) {
    logger.log('info', message, {from: context});
  }

  // verbose?(message: any, ...optionalParams: any[]) {
  verbose?(message: string, context?: string) {
    logger.verbose(message, {from: context});
  }

  // debug?(message: any, ...optionalParams: any[]) {
  debug?(message: string, context?: string) {
    logger.debug(message, {from: context});
  }

  // setLogLevels?(levels: LogLevel[]) {
  //   throw new Error('Method not implemented.');
  // }
}
