const { assert } = require('chai');
const Node = require('../lib/node');

describe('Nodes', () => {
    it('should sort nodes based on dependencies', () => {
        const nodes = [
            new Node('a', 'node a', 'c'),
            new Node('b', 'node b', ['a', 'c']),
            new Node('c', 'node c')
        ];

        assert.deepEqual(Node.sort(nodes), ['node c', 'node a', 'node b']);
    });
});
