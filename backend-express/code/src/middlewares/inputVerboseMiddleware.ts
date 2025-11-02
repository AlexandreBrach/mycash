import { NextFunction, Request, Response } from 'express';
import util from 'util';
import { LoggerServiceInterface } from '../services/Logger/interface';

const getInputVerboseMiddleware = (logger: LoggerServiceInterface, verbose: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (verbose) {
      logger.debug(() => req.method + ' ' + req.path);
      logger.debug(() => util.inspect(req.body, { showHidden: false, depth: null, colors: true }));
    }

    next();
  };
};

export default getInputVerboseMiddleware;
