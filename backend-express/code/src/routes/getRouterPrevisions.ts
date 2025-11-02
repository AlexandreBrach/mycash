import { Request, Response, Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
export const getRouterPrevisions = (): Router => {
  const router = Router();

  router.get(
    '/rules',
    expressAsyncHandler(async (req: Request, res: Response) => {
      res.send({ response: [] });
    }),
  );

  return router;
};
