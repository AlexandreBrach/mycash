import { Tree, treeFindById } from "./Tree";

export const _generatePath = <T>(ids: string[], value: T, defaultValue: T): Tree<T> => {
    if (ids.length > 1) {
        return { id: ids[0], data: defaultValue, children: [_generatePath(ids.slice(1), value, defaultValue)] };
    } else {
        return { id: ids[0], data: value, children: [] };
    }
}


/**
 * Return the list of id to go through in order to find the target
 *
 * @param tree 
 * @param id 
 * @returns 
 */
const pathToId = <T>(tree: Tree<T>, id: string): string[] | undefined => {

    if (id === tree.id) {
        return [tree.id]
    }
    for (let i = 0; i < tree.children.length; i++) {
        if (tree.children[i].id == id) {
            return [tree.id];
        }

        const found = pathToId(tree.children[i], id);
        if (found !== undefined) {
            return [tree.id, ...found];
        }

    };
    return undefined;
}

export class Hierarchie<T> {
    public tree: Array<Tree<T>>;

    public referenceTree: Array<Tree<any>>;

    public defaultValue: T;

    public constructor(referenceTree: Array<Tree<any>>, defaultValue: T) {
        this.tree = [];
        this.referenceTree = referenceTree;
        this.defaultValue = defaultValue;
    }

    /**
     * Inject value and generate arborescence based on the passed reference 
     * If value already exists, does nothing
     * 
     * @param reference 
     * @param value 
     */
    public set = (id: string, value: T) => {

        const p = this.pathToId(id);

        if (p === undefined) {
            throw `id=${id} is not carried by the reference tree`
        }

        const path = [...p, id]

        let t = this.tree
        for (let i = 0; i < path.length; i++) {
            let target = t.find((child) => child.id === path[i]);
            if (target) {
                // go down to the next level
                t = target.children;
                // reach the end of path
                if (path.length === i - 1) {
                    target.children = [{ id, children: [], data: value }]
                }
            } else {
                // create the path with the leaf
                t.push(_generatePath(path.slice(i), value, this.defaultValue));
                break;
            }
        }
    }

    public pathToId = (id: string): string[] | undefined => {
        let result;
        for (let i = 0; i < this.referenceTree.length; i++) {
            result = pathToId(this.referenceTree[i], id);
            if (result !== undefined) {
                break;
            }
        }
        return result;
    }

    /**
     * provide the data at specific index
     * undefined if not found
     * 
     * @param reference 
     * @param value 
     */
    public get = (id: string): T | undefined => {
        return treeFindById(this.tree, id);
    }
}