const express = require('express');
const productsRoute = express.Router();
const {
  httpGetAllProducts,
  httpGetProductsByPrice
}  = require('./products.controller');

productsRoute.get('/' , httpGetAllProducts);
productsRoute.get('/min/max/price',httpGetProductsByPrice)
module.exports= productsRoute;