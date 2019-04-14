const path = require('path');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

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

    User.findOne({'username': 'maciek'})
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});


// register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


const startDbAndServer = () => {
    new User({username: 'maciek', email: 'maciek@test.com', cart: {items: []}})
        .save()
        .catch(ex => ex);

    const server = http.createServer(app);
    server.listen(3000);
    console.log('Listening...');
};

/*
    MongoDB without Mongoose:
        const mongoConnect = require('./util/database').mongoConnect;
        mongoConnect(startDbAndServer);
*/

mongoose.connect('mongodb://localhost:27017/nodecomplete')
    .then(startDbAndServer)
    .catch(err => console.log(err));
