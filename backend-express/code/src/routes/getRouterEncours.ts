import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const getRouterEncours = (): Router => {
  const router = Router();

  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const encoursService = res.locals.factory.getEncoursService();
      const encours = await encoursService.getAll();
      res.status(200).send(encours);
    }),
  );

  return router;
};
