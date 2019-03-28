const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log();
    console.log('In the middleware - calling next()');
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// .use - path prefix matching
// .get, .post - exact matching

app.use((req, res, next) => {
    res.status(404)
        .send('<h1>Page not found</h1>');
});

const server = http.createServer(app);
server.listen(3000);
