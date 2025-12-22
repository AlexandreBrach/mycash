import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const getRouterPrevisions = (): Router => {
  const router = Router();

  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const previsionsService = res.locals.factory.getPrevisionsService();
      const previsions = await previsionsService.getAll();
      res.status(200).send(previsions);
    }),
  );

  router.get(
    '/rules',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const rulesService = res.locals.factory.getRulesService();
      const rules = await rulesService.getAll();
      res.status(200).send(rules);
    }),
  );

  return router;
};
