import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const getRouterGetMonths = (): Router => {
  const router = Router();

  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const extraitService = res.locals.factory.getExtraitService();
      const months = await extraitService.getDistinctMonths();
      res.status(200).send(months);
    }),
  );

  return router;
};
