import { Request, Response, Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UpdateCategoryDto } from '../services/CategoryService/CategoryService';
import { CategoryAssembler } from './assembler/CategoryAssembler';
import { CategoryTreeAssembler } from './assembler/CategoryTreeAssembler';
import { AckAssembler } from './assembler/AckAssembler';

export const getRouterCategories = (): Router => {
  const router = Router();

  // GET /categories - Get all categories
  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const categories = await categoryService.getAllCategories();
      res.send(CategoryAssembler(categories));
    }),
  );

  // GET /categories/tree - Get category tree
  router.get(
    '/tree',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const tree = await categoryService.getCategoryTree();
      res.send(CategoryTreeAssembler(tree));
    }),
  );

  // GET /categories/:id - Get category by ID
  router.get(
    '/:id',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);
      const category = await categoryService.getCategoryById(id);

      if (!category) {
        res.status(404).send({ error: 'Category not found' });
        return;
      }

      res.send({ response: CategoryAssembler(category) });
    }),
  );

  router.post(
    '/add/:name',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const name = req.params.name;
      await categoryService.createCategory(name);
      res.send({ response: AckAssembler() });
    }),
  );

  router.post(
    '/recolor/:id/:color',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const color = req.params.color;
      const id = parseInt(req.params.id);
      const categoryService = res.locals.factory.getCategoryService();
      await categoryService.updateCategory(id, { color });

      res.send({ response: AckAssembler() });
    }),
  );

  router.post(
    '/rename/:id/:name',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const name = req.params.name;
      const id = parseInt(req.params.id);
      const categoryService = res.locals.factory.getCategoryService();
      await categoryService.updateCategory(id, { name });

      res.send({ response: AckAssembler() });
    }),
  );

  // PUT /categories/:id - Update a category
  router.put(
    '/:id',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);
      const dto: UpdateCategoryDto = req.body;

      if (!dto.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
      }

      const category = await categoryService.updateCategory(id, dto);

      if (!category) {
        res.status(404).send({ error: 'Category not found' });
        return;
      }

      res.send({ response: CategoryAssembler(category) });
    }),
  );

  // DELETE /categories/:id - Delete a category
  router.delete(
    '/:id',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);

      await categoryService.deleteCategory(id);
      res.status(200).send();
    }),
  );

  // POST /categories/:id/move - Move a category to a new parent
  router.post(
    '/move/:id/:parent',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);
      const parentId = parseInt(req.params.parent, 10);

      await categoryService.moveCategory(id, parentId);
      res.send({ response: { message: 'Category moved successfully' } });
    }),
  );

  // POST /categories - Create a new category
  router.post(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const { name } = req.body;

      if (!name) {
        res.status(400).send({ error: 'Name is required' });
        return;
      }

      await categoryService.createCategory(name);
      res.status(200).send({ response: AckAssembler() });
    }),
  );

  return router;
};
