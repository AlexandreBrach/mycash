import { Request, Response, Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
export const getRouterPrevisions = (): Router => {
  const router = Router();

  router.get(
    '/rules',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const previsionsService = res.locals.factory.getPrevisionsService();
      const rules = await previsionsService.getAllRules();
      res.send({ response: rules });
    }),
  );

  return router;
};
