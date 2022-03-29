const express = require('express');
const api = express.Router();
const productsRoute= require('./products/products.route');

api.use('/products' , productsRoute);
module.exports= api;