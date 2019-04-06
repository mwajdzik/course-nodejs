const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');


// associations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});


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

    User.findByPk(1)
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

// make sure all tables are in place
sequelize
    .sync({force: false})
    .then(() => User.findByPk(1))
    .then(user => user || User.create({name: 'Maciek', email: 'maciej@gmail.com'}))
    .then(user => {
        user.getCart()
            .then(cart => cart || user.createCart())
            .catch(err => console.log(err));
    })
    .then(() => {
        // create and start the server
        const server = http.createServer(app);
        server.listen(3000);
    })
    .catch(err => console.log(err));

// ---

// .use - path prefix matching
// .get, .post - exact matching

// res:
//      .send('<h1>Some text</h1>');
//      .sendFile(path.join(rootDir, 'views', '404.html'));
//      .render('404', {pageTitle: 'Page not found'});

// template engines:
//      - Handlebars
//      - EJS
//      - Pug
