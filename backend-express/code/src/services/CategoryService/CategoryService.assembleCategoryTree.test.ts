import { Category } from '../../infra/typeorm/category/category';
import { assembleCategoryTree } from './CategoryService';
const fs = require('fs');

const data: Category[] = JSON.parse(fs.readFileSync('./src/services/CategoryService/tests-assets/flat.json'));

it('tree to options', () => {
  const result = assembleCategoryTree(data);
});
