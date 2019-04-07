const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

// create express server
const app = express();

// view engine setup
app.engine('handlebars', expressHandlebars({layoutsDir: 'views/layout/', defaultLayout: 'main-layout'}));
app.set('view engine', 'handlebars');
app.set('views', 'views');


// others
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));


// a user setting middleware
app.use((req, res, next) => {
    console.log('In the app middleware - calling next() to proceed...');

    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));

    next();
});

// register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    const server = http.createServer(app);
    server.listen(3000);
    console.log('Listening...');
});
