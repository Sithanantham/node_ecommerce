require('dotenv').config();
const con = require('./db');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
//export admin
const adminLoginRoutes = require('./routes/adminRoutes/adminLoginRoutes');
const categoryRoutes = require('./routes/adminRoutes/categoryRoutes');
const productRoutes = require('./routes/adminRoutes/productRoutes');
const userRoutes = require('./routes/adminRoutes/userRoutes');
//export website
const productLists = require('./routes/websiteRoutes/productList');
const addToCart = require('./routes/websiteRoutes/addToCart');
const userLoginRoute = require('./routes/websiteRoutes/userLoginRoute');
//export admin api
const productRouteApi = require('./routes/api/admin/productRoutes');
const adminLoginApi = require('./routes/api/admin/adminLoginRoutes');
//export website api
const LoginRoutesApi = require('./routes/api/apiLoginRoutes');

const session = require('express-session');
const flash = require('express-flash');


const app = express();

app.use(session({
    secret: '1234567890abcdefghijklmnopqrstuvwxyz',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}));

app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

//Website Routes
app.use('/', productLists);
app.use('/addToCart', checkUser, addToCart);
app.use('/user', userLoginRoute);

//Website API Routes
app.use('/api/login', LoginRoutesApi);
app.use('/api/', checkJWT, LoginRoutesApi);

//Admin Routes
app.use('/admin/', adminLoginRoutes);
app.use('/admin/users', checkAdmin, userRoutes);
app.use('/admin/categories', checkAdmin, categoryRoutes);
app.use('/admin/products', checkAdmin, productRoutes);

//Admin API Routes
app.use('/admin/api/login', adminLoginApi);
app.use('/admin/api/products', checkAdminJWT, productRouteApi);

function checkAdmin(req, res, next){
    if(req.session && req.session.userType === 2){
        next();
    }else{
        res.redirect('/admin/login');
    }
}

function checkUser(req, res, next){
    if(req.session && req.session.userId){
        next();
    }else{
        res.redirect('/user/login');
    }
}

function checkJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).send({message: 'unauthorized'});
    }else{
        const token = authHeader.split(' ')[1];
        let decoded = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(req.params.id);
        req.params.id = decoded.id;
        next();
    }
}

function checkAdminJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).send({message: 'unauthorized'});
    }else{
        const token = authHeader.split(' ')[1];
        let decoded = jwt.verify(token,  process.env.JWT_TOKEN);
        req.params.id  = decoded.id;
    }
}

app.listen(8000, () => {
    console.log('server running on port 8000');
});

