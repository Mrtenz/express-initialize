import {Node} from '../src/node';
import {expect} from 'chai';

describe('Nodes', () => {
    it('should sort nodes based on dependencies', () => {
        const nodes = [
            new Node('a', Function(), 'c'),
            new Node('b', Function(), ['a', 'c']),
            new Node('c', Function())
        ];
        const result = Node.sort(nodes).map(node => node.name);

        expect(result).to.deep.equal(['c', 'a', 'b']);
    });
});
