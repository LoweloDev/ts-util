export class Tree<T> {
    // @ts-ignore
    data: Partial<T>;
    [child: string]: Tree<T>;

    public static setDataNode<T>(node: Partial<T>): Tree<T> {
        return { data: { ...node } } as Tree<T>;
    }

    public static isChild(nodeId: string, parentId: string): boolean {
        return !!(parentId && parentId !== nodeId);
    }

    public static isRoot(nodeId: any, parentId: any): boolean {
        return !parentId || parentId === nodeId;
    }

    public static exists<T>(node: Tree<T>, idToNodeMap: any): boolean {
        const parentId = (node as any).data['parent'];
        const nodeId = (node as any).data['id'];

        return !!idToNodeMap[parentId][nodeId];
    }

    public static build<T>(list: Partial<T>[]): Tree<T> {
        const idToNodeMap: Tree<T> = {} as Tree<T>;
        const tree: Tree<T> = {} as Tree<T>;

        for (const listElement of list) {
            const nodeId = (listElement as any)['id'];
            const parentId = (listElement as any)['parent'];

            idToNodeMap[nodeId] = this.setDataNode(listElement);

            if (this.isRoot(nodeId, parentId)) {
                tree[nodeId] = idToNodeMap[nodeId];
            }
        }

        for (const nodeId in idToNodeMap) {
            const node = idToNodeMap[nodeId];
            const parentId = (node as any).data['parent'];

            if (this.isChild(nodeId, parentId)) {
                try {
                    if (!this.exists(node, idToNodeMap)) {
                        idToNodeMap[parentId][nodeId] = node;
                    }
                } catch (e) {
                    if (!(e instanceof TypeError)) throw e;

                    console.warn(
                        'Node ' +
                        nodeId +
                        'did point to a (parent) in the tree, that does not exist and is not a root itself. Therefore it will be ignored.',
                    );
                }
            }
        }

        return tree;
    }

    public static traverse<T>(tree: Tree<T>, callback: (key: string, value: any) => void) {
        for (const key in tree) {
            if (key === 'data') {
                continue;
            }

            const value = tree[key];
            if (value && value.data) {
                callback(key, value.data);
                this.traverse(value, callback);
            }
        }
    }

    public static findByKey<T>(tree: Tree<T>, keyToFind: string): Tree<T> | undefined {
        for (const key in tree) {
            if (key === keyToFind) {
                return tree[key];
            } else {
                const subTree = tree[key];
                const result = this.findByKey(subTree, keyToFind);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }

    public static findByKeyQueued<T>(tree: Tree<T>, keyToFind: string): Tree<T> | undefined {
        const queue: Tree<T>[] = [tree];

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (currentNode && currentNode[keyToFind]) {
                return currentNode[keyToFind];
            }

            for (const key in currentNode) {
                if (key !== 'data' && currentNode![key]) {
                    queue.push(currentNode[key]);
                }
            }
        }

        return;
    }
}