const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const rootDir = require('./util/path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

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
        .sendFile(path.join(rootDir, 'views', '404.html'));
});

const server = http.createServer(app);
server.listen(3000);
