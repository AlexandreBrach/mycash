import { NextFunction, Request, Response } from 'express';
import { Factory } from '../services/Factory';

export const factoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.factory = Factory();
  next();
};
