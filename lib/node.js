"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(name, configure, dependencies) {
        this.name = name;
        this.dependencies = dependencies ? (!Array.isArray(dependencies) ? [dependencies] : dependencies) : [];
        this.configure = configure;
    }
    static sort(nodes) {
        let todo = Node.findStart(nodes);
        let sorted = [];
        while (todo.length > 0) {
            let current = todo[0];
            todo.shift();
            sorted.push(current);
            nodes
                .filter(node => node.dependencies.includes(current.name))
                .forEach(node => {
                node.dependencies = node.dependencies.filter(dependency => dependency !== current.name);
                if (!node.hasIncomingEdges(nodes)) {
                    todo.push(node);
                }
            });
        }
        return sorted;
    }
    static findStart(nodes) {
        return nodes.filter(node => !node.hasIncomingEdges(nodes));
    }
    static contains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    hasIncomingEdges(nodes) {
        return nodes.some(node => Node.contains(this.dependencies, node.name));
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map