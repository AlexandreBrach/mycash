import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { DAOFactoryInterface } from '../models/DAOFactory';
import { ApplicationStateServiceInterface } from '../services/ApplicationState/ApplicationStateService';

const getRouterState = (applicationStateService: ApplicationStateServiceInterface): Router => {
  const router = Router();

  router.get(
    '',
    asyncHandler(async (req: Request, res: Response) => {
      const state = await applicationStateService.get();
      res.send(state);
    }),
  );

  router.get(
    '/refresh',
    asyncHandler(async (req: Request, res: Response) => {
      const state = await applicationStateService.set();
      res.send(state);
    }),
  );

  return router;
};

export default getRouterState;
