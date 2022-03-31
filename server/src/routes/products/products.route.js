const express = require('express');
const productsRoute = express.Router();
const {
  httpGetAllProducts,
  httpGetProductsByPrice,
  httpGetProductsStats
}  = require('./products.controller');

productsRoute.get('/' , httpGetAllProducts);
productsRoute.get('/min/max/price',httpGetProductsByPrice)
productsRoute.get('/company' , httpGetProductsStats);
module.exports= productsRoute;