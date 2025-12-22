import { NextFunction, Request, Response } from 'express';

export const unmanagedExceptionMiddleWare = () => {
  return (exception: any, req: Request, res: Response, next: NextFunction) => {
    const logger = res.locals.factory.getLoggerService();
    logger.error(`[UNMANAGED ERROR THROWN] at ${JSON.stringify(req.originalUrl)}`);
    logger.error(exception);
    next(exception);
  };
};
