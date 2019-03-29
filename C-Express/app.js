const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const rootDir = require('./util/path');

const app = express();

app.engine('handlebars', expressHandlebars({layoutsDir: 'views/layout/', defaultLayout: 'main-layout'}));
app.set('view engine', 'handlebars');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    console.log();
    console.log('In the middleware - calling next()');
    next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// .use - path prefix matching
// .get, .post - exact matching

// res:
//      .send('<h1>Some text</h1>');
//      .sendFile(path.join(rootDir, 'views', '404.html'));
//      .render('404', {pageTitle: 'Page not found'});

app.use((req, res, next) => {
    res.status(404)
        .render('404', {pageTitle: 'Page not found'});
});

const server = http.createServer(app);
server.listen(3000);

// template engines:
//      - Handlebars
//      - EJS
//      - Pug
