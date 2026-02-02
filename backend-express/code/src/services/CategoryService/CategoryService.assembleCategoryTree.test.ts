import { Category, CategoryProperties } from '../../models/Category';
import { assembleCategoryTree } from './CategoryService';
const fs = require('fs');

const data: CategoryProperties[] = JSON.parse(fs.readFileSync('./src/services/CategoryService/tests-assets/flat.json'));

it('tree to options', () => {
  const result = assembleCategoryTree(data.map((d) => new Category(d)));
});
