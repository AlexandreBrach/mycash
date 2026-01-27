import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Interval } from '../helpers/interval';
import { PrevisionAssembler } from './assembler/PrevisionAssembler';
import { RuleAssembler } from './assembler/RuleAssembler';
import { EchecanceAssembler } from './assembler/EcheanceAssembler';

export const getRouterPrevisions = (): Router => {
  const router = Router();

  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const previsionsService = res.locals.factory.getPrevisionsService();
      const previsions = await previsionsService.getAll();
      res.status(200).send(PrevisionAssembler(previsions));
    }),
  );

  router.get(
    '/rules',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const rulesService = res.locals.factory.getRulesService();
      const rules = await rulesService.getAll();
      res.status(200).send(RuleAssembler(rules));
    }),
  );

  router.get(
    '/echeances/:start/:end',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const interval = new Interval(new Date(req.params.start), new Date(req.params.end));
      const previsionService = res.locals.factory.getPrevisionsService();
      const echeances = await previsionService.getEcheancesInInterval(interval);
      res.status(200).send(EchecanceAssembler(echeances));
    }),
  );

  router.get(
    '/echeanciers',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const previsionsService = res.locals.factory.getPrevisionsService();
      const echeancierIds = await previsionsService.getEcheancierIds();
      res.status(200).send(echeancierIds);
    }),
  );

  return router;
};
