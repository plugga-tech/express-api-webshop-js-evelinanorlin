var express = require('express');
require('dotenv').config()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const PORT = 4000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');

const mongoose = require('mongoose');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

async function init() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to database')

  } catch(error){
    console.error(error)
  } 
  app.listen(PORT, () => console.log(`server is up and running on port: ${PORT}`))
}

init()

module.exports = app;
