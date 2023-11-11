import { Tree } from '../util/tree';

describe('Tree', () => {
    test('setDataNode should set data node correctly', () => {
        const node = { id: '1', parent_category: '0' };
        const result = Tree.setDataNode(node);
        expect(result.data).toEqual(node);
    });

    test('isChild should correctly identify child nodes', () => {
        const nodeId = '1';
        const parentId = '0';
        const result = Tree.isChild(nodeId, parentId);
        expect(result).toBe(true);
    });

    test('isChild should correctly identify child nodes', () => {
        const tree: Partial<{ id: string, name: string, parent: any }>[] = [
            {
                id: '1',
                name: 'test',
                parent: null,
            },
            {
                id: '2',
                name: 'test2',
                parent: '1'
            }
        ]
        const result = Tree.build(tree);

        const found = Tree.findByKey(result, '2');

        expect(found?.data).toMatchObject(
            { id: '2', name: 'test2', parent: '1' }
        )
    });

});