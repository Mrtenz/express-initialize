import {Node} from './node';

export interface Initializer {
    name: string;
    after?: string[] | string;
    configure: (app) => void | Promise<void>;
}

export const initialize = (app, initializers: Initializer[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const nodes = [];
        initializers.forEach(initializer => {
            nodes.push(new Node(initializer.name, initializer.configure, initializer.after));
        });

        const sorted = Node.sort(nodes);
        process(app, sorted, resolve, reject);
    });
};

function process(app, nodes: Node[], resolve, reject): void {
    if (nodes.length > 0) {
        const current = nodes.shift();

        const result = current.configure(app);
        if (result instanceof Promise) {
            result
                .then(() => {
                    process(app, nodes, resolve, reject);
                })
                .catch(reject);
        } else {
            process(app, nodes, resolve, reject);
        }
    } else {
        resolve();
    }
}
