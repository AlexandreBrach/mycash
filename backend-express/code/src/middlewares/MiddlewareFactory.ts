import { FactoryInterface } from '../services/Factory';

import getErrorHandlerMiddleWare from './errorHandlerMiddleware';
import getInputVerboseMiddleware from './inputVerboseMiddleware';
import getUnmanagedExceptionMiddleWare from './unmanagedExceptionMiddleware';

import getWrapUserResponseMiddleware from './wrapUserResponse';
import getWrapResponseMiddleware from './wrapResponse';
import { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export interface MiddlewareFactoryInterface {
  errorHandlerMiddleWare: (err: unknown, req: Request, res: Response, next: NextFunction) => void;
  unmanagedExceptionMiddleWare: (err: unknown, req: Request, res: Response, next: NextFunction) => void;
  inputVerboseMiddleware: (req: Request, res: Response, next: NextFunction) => void;
  wrapUserResponseMiddleware: (req: Request, res: Response, next: NextFunction) => void;
  wrapResponseMiddleware: (req: Request, res: Response, next: NextFunction) => void;
}

const MiddlewareFactory = (factory: FactoryInterface): MiddlewareFactoryInterface => {
  const logger = factory.getLoggerService();
  return {
    errorHandlerMiddleWare: getErrorHandlerMiddleWare(logger),
    unmanagedExceptionMiddleWare: getUnmanagedExceptionMiddleWare(logger),
    inputVerboseMiddleware: getInputVerboseMiddleware(logger, config.DEBUG_HTTP),
    wrapUserResponseMiddleware: getWrapUserResponseMiddleware(),
    wrapResponseMiddleware: getWrapResponseMiddleware(),
  };
};

export default MiddlewareFactory;
