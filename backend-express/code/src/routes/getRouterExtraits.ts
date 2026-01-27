import { Router, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import multer from 'multer';
import { AckAssembler } from './assembler/AckAssembler';
import { ExtraitAssembler } from './assembler/ExtraitAssembler';

export const getRouterExtraits = (): Router => {
  const router = Router();

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
      } else {
        cb(new Error('Le fichier doit être au format CSV'));
      }
    },
  });

  router.post(
    '/upload',
    upload.single('fileUpload'),
    expressAsyncHandler(async (req: Request, res: Response) => {
      const extraitService = res.locals.factory.getExtraitService();
      if (!req.file) {
        res.status(400).send({ error: 'Aucun fichier fourni' });
        return;
      }

      const fileContent = req.file.buffer.toString('utf-8');
      await extraitService.injectCsv(fileContent);

      res.status(200).send({
        message: 'Fichier CSV reçu avec succès',
        filename: req.file.originalname,
        size: req.file.size,
      });
    }),
  );

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
      res.status(200).send(ExtraitAssembler(extraits));
    }),
  );

  router.post(
    '/set-category/:categoryId(\\d+)',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const extraitService = res.locals.factory.getExtraitService();
      const categoryId = parseInt(req.params.categoryId);
      const ids = req.body.ids;
      await extraitService.assignCategory(categoryId, ids);
      res.status(200).send(AckAssembler());
    }),
  );

  router.post(
    '/date-reference',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const extraitService = res.locals.factory.getExtraitService();
      const { ids, month } = req.body;
      const parts = month.split('-').map((e: string) => parseInt(e));
      const date = new Date(Date.UTC(parts[0], parts[1]) - 1);
      await extraitService.assignDateRef(date, ids);
      res.status(200).send(AckAssembler());
    }),
  );

  return router;
};
