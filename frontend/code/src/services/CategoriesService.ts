import { Tree } from "../exportable/Hierarchie/Tree";
import { BackendCategory, assembleBackendCategoryTree } from "../helpers/categories";
import { BackendFacadeInterface } from "./backendFacade";

export interface CategorieServiceInterface {
  getTree: () => Promise<Array<Tree<{ name: string, color: string }>>>;
  change: (ids: string[], new_value: string) => unknown;
  create: (name: string) => unknown;
  move: (id: string, ancestorId: string) => unknown;
  rename: (id: string, newName: string) => unknown;
  delete: (id: string) => unknown;
  updateColor: (id: string, color: string) => Promise<void>;
}

const CategorieService = (backend: BackendFacadeInterface): CategorieServiceInterface => {

  return {
    getTree: async (): Promise<Array<Tree<{ name: string, color: string }>>> => {
      return assembleBackendCategoryTree(await backend.post<Record<string, BackendCategory>>("/get-categories-tree", {}));
    },
    change: async (ids: string[], new_value: string) => {
      return await backend.post("/set-category/" + new_value, {
        ids
      });
    },

    /**
     * create category
     *
     */
    create: async (name: string) => {
      return await backend.post("/add-category/" + name, {});
    },

    /**
     * move category
     *
     */
    move: async (id: string, ancestorId: string) => {
      return await backend.post("/move-category/" + id + "/" + ancestorId, {});
    },

    /**
     * rename category
     *
     */
    rename: async (id: string, newName: string) => {
      return await backend.post("/rename-category/" + id + "/" + newName, {});
    },

    /**
     * rename category
     *
     */
    delete: async (id: string) => {
      return await backend.post("/delete-category/" + id, {});
    },

    updateColor: async (id: string, color: string) => {
      const url = `/update-category-color/${id}/${color.substring(1)}`
      await backend.post(url, {});
    }

  };
};

export default CategorieService;