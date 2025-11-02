import { Request, Response } from 'express';

export const unmanagedExceptionMiddleWare = () => {
  return (exception: any, req: Request, res: Response) => {
    const logger = res.locals.factory.getLoggerService();
    logger.error(`[UNMANAGED ERROR THROWN] at ${JSON.stringify(req.originalUrl)}`);
    logger.error(exception);
    res.status(500).send('{"message":"Unexpected error occurs"}');
  };
};
