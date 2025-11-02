import { Request } from 'express';
import { LoggerServiceInterface } from '../Logger/interface';
import util from 'util';

export interface DebugServiceInterface {
  inputVerbose: (req: Request) => void;
}

export const DebugService = (verbose: boolean, logger: LoggerServiceInterface): DebugServiceInterface => ({
  inputVerbose: (req: Request) => {
    logger.debug(() => req.method + ' ' + req.path);
    logger.debug(() => util.inspect(req.body, { showHidden: false, depth: null, colors: true }));
  },
});
