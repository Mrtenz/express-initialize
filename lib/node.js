class Node {
    constructor(name, value, dependencies) {
        this.name = name;
        this.value = value;
        this.dependencies = dependencies ? (!Array.isArray(dependencies) ? [dependencies] : dependencies) : [];
    }

    static sort(nodes) {
        let todo = Node.findStart(nodes);
        let sorted = [];

        while (todo.length > 0) {
            let current = todo[0];
            todo.shift();
            sorted.push(current.value);

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

    hasIncomingEdges(nodes) {
        return nodes.some(node => this.dependencies.includes(node.name));
    }
}

module.exports = Node;
