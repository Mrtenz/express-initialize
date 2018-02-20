"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
exports.initialize = (app, initializers) => {
    return new Promise((resolve, reject) => {
        const nodes = [];
        initializers.forEach(initializer => {
            nodes.push(new node_1.Node(initializer.name, initializer.configure, initializer.after));
        });
        const sorted = node_1.Node.sort(nodes);
        process(app, sorted, resolve, reject);
    });
};
function process(app, nodes, resolve, reject) {
    if (nodes.length > 0) {
        const current = nodes.shift();
        const result = current.configure(app);
        if (result instanceof Promise) {
            result
                .then(() => {
                process(app, nodes, resolve, reject);
            })
                .catch(reject);
        }
        else {
            process(app, nodes, resolve, reject);
        }
    }
    else {
        resolve();
    }
}
//# sourceMappingURL=initializer.js.map