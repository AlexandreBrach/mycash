import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const getRouterExtraits = (): Router => {
  const router = Router();

  router.get(
    '/filter',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const extraitService = res.locals.factory.getExtraitService();

      // Validation des paramètres
      const categoryId = !req.query.categoryId ? undefined : Number(req.query.categoryId);

      if (categoryId && isNaN(categoryId)) {
        res.status(400).send({ error: 'categoryId must be a valid number' });
        return;
      }

      const month = req.query.month as string;
      if (!month || !/^\d{4}-\d+$/.test(month)) {
        res.status(400).send({ error: 'month must be in YYYY-MM format' });
        return;
      }

      const extraits = await extraitService.getExtraitsByCategoryAndMonth({ categoryId, month });
      res.status(200).send(extraits);
    }),
  );

  return router;
};
