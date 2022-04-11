const express = require('express');
const api = express.Router();
const userRoute= require('./users/user.route');
const productsRoute= require('./products/products.route');

api.use('/users' , userRoute);
api.use('/products' , productsRoute);
module.exports= api;