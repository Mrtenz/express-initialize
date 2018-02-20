# express-initialize
A simple Express app initializer.

Install it with NPM or Yarn:
```bash
$ npm install --save express-initialize
```
```bash
$ yarn add express-initialize
```

### Example
#### Before
Everything is done in the app.js file:
```js
// app/app.js

const express = require('express');
const handlebars = require('express-handlebars');
const orm = require('orm');

const app = express();

const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        someFunction: () => { return 'Something'; }
    },
    // More configuration etc.
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('./static'));
app.use(compression());

app.get('/home', (request, response) => {
    response.render('home');
});

app.get('/other-page', (request, response) => {
    response.render('other-page');
});

orm.connect('mysql://root:password@host/database')
    .then(connection => {
        // etc.
    })
    .catch(console.error);

app.listen(80);
```

#### After
Everything is moved to separate files:
```js
// app/app.js

const express = require('express');
const expressInitialize = require('express-initialize');

const app = express();

const initializers = getInitializers(); // Load the initializers
expressInitialize.initialize(app, initializers)
    .then(() => {
        app.listen(80);
    })
    .catch(console.error);
```

The function `initialize` takes two arguments: the Express app that will be passed to the initializers and an array containing the initializers.

An initializer is an object which can have three properties:

| Name        | Type                 | Description                                                                       |
| ----------- | -------------------- | --------------------------------------------------------------------------------- |
| `name`      | `string`             | Name of the initializer, for usage with `after`.                                  |
| `after`     | `string or string[]` | Name(s) of the initializer(s) after which the initializer should be run.          |
| `configure` | `function`           | The function that will be run, takes `app` as argument and may return a Promise.  |

For example, a file for Handlebars.
```js
// app/initializers/handlebars.js

module.exports = {
    configure: app => {
        const hbs = handlebars.create({
            defaultLayout: 'main',
            helpers: {
                someFunction: () => { return 'Something'; }
            },
            // More configuration etc.
        });
        app.engine('handlebars', hbs.engine);
        app.set('view engine', 'handlebars');
    }
};
```

You can also return a Promise.
```js
// app/initializers/database.js

module.exports = {
    configure: app => {
        return new Promise((resolve, reject) => {
            orm.connect('mysql://root:password@host/database')
                .then(connection => {
                    // do something with connection
                    resolve();
                })
                .catch(reject);
        });
    }
}
```

Or specify what initializers have to run first.
```js
// app/initializers/routes.js

module.exports = {
    after: 'middleware',
    configure: app => {
        app.get('/home', (request, response) => {
            response.render('home');
        });
    }
}
```
