export interface Tree<T> {
    id: string;
    children: Tree<T>[];
    data: T;
}

export type FlatTree<T> = Array<{ id: string, data: T }>;

export type TreeReducerMethod<T> = (curr: T, prev: T) => T;

export type TreeDerivativeMethod<T> = (ancestor: T, n: number, depth: number) => Array<T>;

/**
 * Return a new tree where reducer were recursively applied on any branch
 * 
 * @param tree 
 * @param reducer 
 * @param initialValue 
 * @returns 
 */
export const treeReduce = <T>(tree: Tree<T>, reducer: TreeReducerMethod<T>, initialValue: T): Tree<T> => {
    const children = tree.children.map((child: Tree<T>) => treeReduce(child, reducer, initialValue));
    return {
        id: tree.id,
        data: children.length === 0 ? tree.data : children.map((c) => c.data).reduce(reducer, initialValue),
        children
    }
}


/**
 * Return a new flat tree where reducer were recursively applied based on the reference tree
 * 
 * @param tree 
 * @param reducer 
 * @param initialValue 
 * @returns 
 */
export const treeFlatReduce = <T>(ref: Array<Tree<any>>, flat: FlatTree<T>, reducer: TreeReducerMethod<T>, initialValue: T): FlatTree<T> => {
    let result: FlatTree<T> = [];
    ref.forEach((itemRef) => {
        if (itemRef.children.length !== 0) {
            const reducedChildren = treeFlatReduce(itemRef.children, flat, reducer, initialValue);
            if (reducedChildren.length !== 0) {
                result = [...result, ...reducedChildren];
                const childrenIds = itemRef.children.map((c) => c.id);
                result.push({
                    id: itemRef.id,
                    data: result.filter((r) => childrenIds.indexOf(r.id) !== -1).map((t) => t.data).reduce(reducer, initialValue)
                });
            }

        } else {
            const item = flat.filter((f) => f.id === itemRef.id)[0];
            if (item !== undefined) {
                result.push({
                    id: itemRef.id,
                    data: item.data
                })
            }
        }
    })
    return result;
}


/**
 * Return a new tree where dreivative were recursively applied from top to leafs
 * 
 * @param tree 
 * @param reducer 
 * @param initialValue 
 * @returns 
 */
export const treeDerive = <T>(tree: Tree<T>, derivative: TreeDerivativeMethod<T>, depth: number = 0): Tree<T> => {

    const derivedValues = derivative(tree.data, tree.children.length, depth);
    const newChildren = tree.children.map((c, i) => ({
        ...c,
        data: derivedValues[i],
    }))
    return {
        ...tree,
        children: newChildren.map((children) => treeDerive(children, derivative, depth + 1))
    };
}


/**
 * Return a raw flat version of the tree as an array of {id, data}
 * 
 * @param tree 
 * @returns 
 */
export const treeFlatten = <T>(tree: Array<Tree<T>>): Array<{ id: string, data: T }> => {
    return tree.map((t) => [{ id: t.id, data: t.data }, ...treeFlatten(t.children)]).flat()
}

/**
 * Apply a map function on the data of any tree member 
 * and return the new structure
 * 
 * @param tree 
 * @param splitMethod 
 */
export const treeMap = <T, T2>(tree: Array<Tree<T>>, method: (t: T) => T2): Array<Tree<T2>> => {
    return tree.map((t) => ({
        id: t.id,
        data: method(t.data),
        children: treeMap(t.children, method)
    }))
}

/**
 * Return the first object responding to the given id
 * 
 * @param tree 
 * @param id 
 * @returns 
 */
export const treeFindById = <T>(tree: Tree<T>[], id: string): T | undefined => {
    for (let i = 0; i < tree.length; i++) {
        const t = tree[i];
        if (t.id == id) {
            return t.data;
        }
        if (t.children) {
            const found = treeFindById(t.children, id);
            if (found !== undefined) {
                return found;
            }
        }
    };
    return undefined;
}

export const getAllDescendantId = <T>(tree: Tree<T>): string[] => {
    return [...tree.children.map((c) => c.id), ...tree.children.map((c) => getAllDescendantId(c)).flat()]
}
