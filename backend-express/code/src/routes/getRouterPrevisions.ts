import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { RuleAssembler } from './assembler/RuleAssembler';
import { EcheanceAssembler } from './assembler/EcheanceAssembler';
import { Interval } from '../exportable/Interval/Interval';
import { Month } from '../exportable/Interval/Month';

export const getRouterPrevisions = (): Router => {
  const router = Router();

  router.get(
    '/between/:start/:end',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const { start, end } = req.params;
      const startMonth = Month.fromString(start as string);
      const endMonth = Month.fromString(end as string);
      const previsionsService = res.locals.factory.getPrevisionsService();
      const echeances = await previsionsService.getAllBetweenDates(startMonth, endMonth);
      res.status(200).send(EcheanceAssembler(echeances));
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
      const interval = new Interval(new Date(req.params.start as string), new Date(req.params.end as string));
      const previsionService = res.locals.factory.getPrevisionsService();
      const echeances = await previsionService.getEcheancesInInterval(interval);
      res.status(200).send(EcheanceAssembler(echeances));
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
