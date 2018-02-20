export class Node {
    public static sort(nodes): Node[] {
        const todo = Node.findStart(nodes);
        const sorted = [];

        while (todo.length > 0) {
            const current = todo.shift();
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

    private static findStart(nodes) {
        return nodes.filter(node => !node.hasIncomingEdges(nodes));
    }

    private static contains<T>(array: T[], object: T): boolean {
        let index = array.length;
        while (index--) {
            if (array[index] === object) {
                return true;
            }
        }
        return false;
    }

    public readonly name: string;
    public readonly dependencies: string[];
    public readonly configure: (app) => void | Promise<void>;

    constructor(name: string, configure: (app) => void | Promise<void>, dependencies?: string[] | string) {
        this.name = name;
        this.dependencies = dependencies ? (!Array.isArray(dependencies) ? [dependencies] : dependencies) : [];
        this.configure = configure;
    }

    private hasIncomingEdges(nodes): boolean {
        return nodes.some(node => Node.contains(this.dependencies, node.name));
    }
}
