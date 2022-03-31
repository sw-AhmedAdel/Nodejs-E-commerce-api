const express = require('express');
const productsRoute = express.Router();
const {
  httpGetAllProducts,
  httpGetProductsByPrice,
  httpGetProductsStats,
  httpGetProductsForEachCompany
}  = require('./products.controller');

productsRoute.get('/' , httpGetAllProducts);
productsRoute.get('/min/max/price',httpGetProductsByPrice)
productsRoute.get('/stats' , httpGetProductsStats);
productsRoute.get('/company',httpGetProductsForEachCompany)
module.exports= productsRoute;