import Color from 'color';
import { Tree, TreeDerivativeMethod, treeFindById } from '../exportable/Hierarchie/Tree';

/**
 * Method to be used with treeDerive
 * it provides a color degradation
 *
 * @param ancestor
 * @param n
 * @param depth
 * @returns
 */
export const camaieuDerivative: TreeDerivativeMethod<{ color: string }> = (
  ancestor: { color: string },
  n: number,
  depth: number,
) => {
  let c: Color;
  try {
    c = Color(ancestor.color);
  } catch (e) {
    c = Color('#AAAAAA');
  }

  const method =
    depth === 0
      ? (c: Color, n: number, i: number): string => {
          // Deeper level : saturation scale
          let d = c.desaturate((i + 1) / (n + 1));
          return d.hex();
        }
      : (c: Color, n: number, i: number): string => {
          // Top level : Light scale
          let d = c.lighten((i + 1) / (n + 1));
          return d.hex();
        };

  return [...Array(n).keys()].map((k) => ({ color: method(c, n, k) }));
};

export const getCategoryName = (availableCategories: Array<Tree<{ name: string }>>, id: string): string => {
  const cat = treeFindById(availableCategories, id);
  return !cat ? 'unknown categorie' : cat.name;
};

export interface BackendCategory {
  name: string;
  color: string;
  children?: Record<string, BackendCategory>;
}

export const assembleBackendCategoryTree = (
  raw: Record<string, BackendCategory>,
): Array<Tree<{ name: string; color: string }>> => {
  return Object.keys(raw).map((id) => ({
    id,
    data: {
      name: raw[id].name,
      color: raw[id].color,
    },
    children: raw[id].children ? assembleBackendCategoryTree(raw[id].children!) : [],
  }));
};
