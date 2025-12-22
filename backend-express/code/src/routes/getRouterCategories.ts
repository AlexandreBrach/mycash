import { Request, Response, Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  MoveCategoryDto,
} from '../services/CategoryService/CategoryService';

export const getRouterCategories = (): Router => {
  const router = Router();

  // GET /categories - Get all categories
  router.get(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const categories = await categoryService.getAllCategories();
      res.send({ response: categories });
    }),
  );

  // GET /categories/tree - Get category tree
  router.get(
    '/tree',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const tree = await categoryService.getCategoryTree();
      res.send({ response: tree });
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

      res.send({ response: category });
    }),
  );

  // POST /categories - Create a new category
  router.post(
    '/',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const dto: CreateCategoryDto = req.body;

      if (!dto.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
      }

      const category = await categoryService.createCategory(dto);
      res.status(201).send({ response: category });
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

      res.send({ response: category });
    }),
  );

  // DELETE /categories/:id - Delete a category
  router.delete(
    '/:id',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);

      await categoryService.deleteCategory(id);
      res.status(204).send();
    }),
  );

  // POST /categories/:id/move - Move a category to a new parent
  router.post(
    '/:id/move',
    expressAsyncHandler(async (req: Request, res: Response) => {
      const categoryService = res.locals.factory.getCategoryService();
      const id = parseInt(req.params.id, 10);
      const dto: MoveCategoryDto = req.body;

      if (!dto.newParentId) {
        res.status(400).send({ error: 'newParentId is required' });
        return;
      }

      await categoryService.moveCategory(id, dto);
      res.send({ response: { message: 'Category moved successfully' } });
    }),
  );

  return router;
};
