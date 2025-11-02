import { NextFunction, Request, Response } from 'express';
import { LoggerServiceInterface, LogLevel } from '../services/Logger/interface';
import { ServiceException } from '../core/exceptions';

export interface ExceptionInfo {
  message: string;
  exception: unknown;
}

function isExceptionInfo(data: any): data is ExceptionInfo {
  return typeof data === 'object' && 'message' in data && 'exception' in data;
}

const getErrorHandlerMiddleWare =
  (logger: LoggerServiceInterface) => (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServiceException) {
      let publicMessage = err.publicMessage ? err.publicMessage : 'Unexpected error occurs';
      const httpStatus = err.httpStatus ? err.httpStatus : 500;
      const level = err.logLevel ? err.logLevel : LogLevel.ERROR;
      const logMessage = err.logMessage;
      logger.log(logMessage, level);
      res.status(httpStatus).send(`{"message":"${publicMessage}"}`);
      return;
    }
    if (isExceptionInfo(err)) {
      const exception = err.exception;
      if (exception instanceof ServiceException) {
        let publicMessage = exception.publicMessage ? exception.publicMessage : 'Unexpected error occurs';
        const httpStatus = exception.httpStatus ? exception.httpStatus : 500;
        const level = exception.logLevel ? exception.logLevel : LogLevel.ERROR;
        const logMessage = exception.logMessage;
        logger.log(logMessage, level);
        if (err.message) {
          publicMessage = `${err.message} : ${publicMessage}`;
        }
        res.status(httpStatus).send(`{"message":"${publicMessage}"}`);
      } else {
        logger.error(`"${err.message}" : ExceptionInfo with a non-business exception.`);
        next(err.exception);
      }
    } else {
      next(err);
    }
  };
export default getErrorHandlerMiddleWare;
