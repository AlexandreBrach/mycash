import { Request, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { ResponseLocals } from '../infra/mvc/ResponseLocals';

const getRouterState = (): Router => {
  const router = Router();

  router.get(
    '',
    asyncHandler(async (req: Request, res: ResponseLocals) => {
      const applicationStateService = res.locals.factory.getApplicationStateService();
      const state = await applicationStateService.get();
      res.send(state);
    }),
  );

  router.get(
    '/refresh',
    asyncHandler(async (req: Request, res: ResponseLocals) => {
      const applicationStateService = res.locals.factory.getApplicationStateService();
      const state = await applicationStateService.set();
      res.send(state);
    }),
  );

  return router;
};

export default getRouterState;
