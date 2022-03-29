const express = require('express');
const productsRoute = express.Router();
const {
  httpGetAllProducts,
}  = require('./products.controller');

productsRoute.get('/' , httpGetAllProducts);
module.exports= productsRoute;