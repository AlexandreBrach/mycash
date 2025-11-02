import { NextFunction, Request, Response } from 'express';

export const inputVerboseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const debugService = res.locals.factory.getDebugService();
  debugService.inputVerbose(req);
  next();
};
