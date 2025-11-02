import { NextFunction, Request, Response } from 'express';
import { LoggerServiceInterface } from '../services/Logger/interface';

const getUnmanagedExceptionMiddleWare = (logger: LoggerServiceInterface) => {
  return (exception: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`[UNMANAGED ERROR THROWN] at ${JSON.stringify(req.originalUrl)}`);
    logger.error(exception);
    res.status(500).send('{"message":"Unexpected error occurs"}');
  };
};

export default getUnmanagedExceptionMiddleWare;
