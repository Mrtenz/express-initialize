const fs = require('fs-extra');
const path = require('path');
const Node = require('./node');

function getInitializers(directory) {
    return new Promise((resolve, reject) => {
        return fs.readdir(directory)
            .then(files => files.filter(file => path.extname(file) === '.js'))
            .then(files => {
                const initializers = [];
                files.forEach(file => {
                    const initializer = require(path.join(directory, file));
                    initializers.push(initializer);
                    if (!initializer.name) {
                        initializer.name = file.slice(0, -3);
                    }
                });
                resolve(initializers);
            })
            .catch(reject);
    });
}

function process(app, initializers, resolve, reject) {
    if (initializers.length > 0) {
        const current = initializers[0];
        initializers.shift();

        const result = current.configure(app);
        if (result instanceof Promise) {
            console.log('is promise');
            result
                .then(() => {
                    process(app, initializers, resolve, reject);
                })
                .catch(reject);
        } else {
            process(app, initializers, resolve, reject);
        }
    } else {
        resolve();
    }
}

module.exports = (app, options) => {
    return new Promise((resolve, reject) => {
        getInitializers(options.directory || path.join(process.cwd(), 'app/initializers'))
            .then(initializers => {
                const nodes = [];
                initializers.forEach(initializer => {
                    nodes.push(new Node(initializer.name, initializer, initializer.after));
                });

                const sorted = Node.sort(nodes);
                process(app, sorted, resolve, reject);
            })
            .catch(reject);
    });
};
