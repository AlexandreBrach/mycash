import { NextFunction, Request } from 'express';
import { ResponseLocals } from '../infra/mvc/ResponseLocals';

export const inputVerboseMiddleware = (req: Request, res: ResponseLocals, next: NextFunction) => {
  const debugService = res.locals.factory.getDebugService();
  debugService.inputVerbose(req);
  next();
};
