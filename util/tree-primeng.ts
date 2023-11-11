export interface TreeNode<T = any> {
    /**
     * Label of the node.
     */
    label?: string;
    /**
     * Data represented by the node.
     */
    data?: Partial<T>;
    /**
     * Icon of the node to display next to content.
     */
    icon?: string;
    /**
     * Icon to use in expanded state.
     */
    expandedIcon?: string;
    /**
     * Icon to use in collapsed state.
     */
    collapsedIcon?: string;
    /**
     * An array of treenodes as children.
     */
    children?: TreeNode<T>[];
    /**
     * Specifies if the node has children. Used in lazy loading.
     * @defaultValue false
     */
    leaf?: boolean;
    /**
     * Expanded state of the node.
     * @defaultValue false
     */
    expanded?: boolean;
    /**
     * Type of the node to match a template.
     */
    type?: string;
    /**
     * Parent of the node.
     */
    parent?: TreeNode<T>;
    /**
     * Defines if value is partially selected.
     */
    partialSelected?: boolean;
    /**
     * Inline style of the node.
     */
    style?: any;
    /**
     * Style class of the node.
     */
    styleClass?: string;
    /**
     * Defines if the node is draggable.
     */
    draggable?: boolean;
    /**
     * Defines if the node is droppable.
     */
    droppable?: boolean;
    /**
     * Whether the node is selectable when selection mode is enabled.
     * @defaultValue false
     */
    selectable?: boolean;
    /**
     * Mandatory unique key of the node.
     */
    key?: string;
}


export class TreeUtil {
    public static buildDataTreeDefault<T>(list: Partial<T>[]): TreeNode<T>[] {
        const idToNodeMap: Record<string, TreeNode<T>> = {};

        // First, create all nodes and add them to idToNodeMap
        for (const listElement of list) {
            const nodeId = listElement['id'];

            idToNodeMap[nodeId] = {
                key: listElement['id'],
                label: listElement['translations'] ? listElement['translations']['en'] : '',
                data: listElement,
                children: [],
            };
        }

        // Then, assign child nodes to their respective parents
        for (const listElement of list) {
            const nodeId = listElement['id'];
            const parentId = listElement['parent_category'];

            if (parentId && idToNodeMap[parentId]) {
                idToNodeMap[parentId].children.push(idToNodeMap[nodeId]);
            }
        }

        const rootNodes: TreeNode<T>[] = [];

        for (const nodeId in idToNodeMap) {
            const node = idToNodeMap[nodeId];
            const parentId = node.data!['parent_category'];

            if (!parentId) {
                rootNodes.push(node);
            }
        }

        return rootNodes;
    }

    public static findByKeyQueuedPrimeNg<T>(
        treeNodes: TreeNode[],
        keyToFind: string,
    ): TreeNode | undefined {
        const queue: TreeNode[] = [...treeNodes];

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (currentNode && currentNode.key === keyToFind) {
                return currentNode;
            }

            if (currentNode.children) {
                queue.push(...currentNode.children);
            }
        }

        return;
    }
}
