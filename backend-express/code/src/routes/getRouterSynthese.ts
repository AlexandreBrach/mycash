import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const getRouterSynthese = (): Router => {
  const router = Router();

  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const syntheseService = res.locals.factory.getSyntheseService();
      const synthese = await syntheseService.getSyntheseCategory();
      res.status(200).send(synthese);
    }),
  );

  return router;
};
