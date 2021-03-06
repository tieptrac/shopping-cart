var express = require('express');
var exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
var bodyParser = require('body-parser');
var path = require('path');
var wnumb = require('wnumb');
const stripe = require('stripe')('sk_test_51GuZ1WKaF92KR9scpczQ4i6W4NHYDRH11N7kmzOQkdsR0ZPsrAQJZqU04GWH8m4lkIDshWblGUkcNowwZDf0mEO300Rlu9tf3n');
// (async () => {
//     const charge = await stripe.charges.create({
//       amount: 280,
//       currency: 'vnd',
//       source: 'tok_visa',
//       receipt_email: 'tieptrac@example.com',
//     });
//   })();

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var handleLayoutMDW = require('./middle-wares/handleLayout'),
    handle404MDW = require('./middle-wares/handle404');
    restrict=require('./middle-wares/restrict')

var homeController = require('./controllers/homeController'),
    productController = require('./controllers/productController'),
    accountController = require('./controllers/accountController'),
    searchController = require('./controllers/searchController'),
    adminController = require('./controllers/adminController'),
    checkoutController = require('./controllers/checkoutController')

var app = express();

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'views/_layouts/',
    helpers: {
        section: express_handlebars_sections(),
        number_format: n => {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        },
        isSelected: function(value, options) {
            if(options.fn(this).indexOf(value) >= 1) {
                return `selected = 'selected'`;
            }
        }
    }
}));
app.set('view engine', 'hbs');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_shopping-cart',
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    },
    
});


app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(handleLayoutMDW);

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.use('/home', homeController);
app.use('/product', productController);
app.use('/account', accountController);
app.use('/search', searchController);
app.use('/checkout', checkoutController);
app.use('/admin', adminController);

app.use(handle404MDW);

app.listen(3000, () => {
    console.log('Site running on port 3000');
});