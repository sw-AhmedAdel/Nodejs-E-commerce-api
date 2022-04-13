const express = require('express');
const productsRoute = express.Router();
const {
  httpCreateNewProduct,
  httpGetAllProducts,
  httpGetProductsByPrice,
  httpGetProductsStats,
  httpGetProductsForEachCompany,
  httpGetSingleProduct,
  httpUpdateProduct,
  httpDeleteOneProduct
}  = require('./products.controller');

const {
  catchAsync
} =require('../../services/query');

const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');


productsRoute.get('/' , catchAsync( httpGetAllProducts));
productsRoute.get('/single/product/:id' , catchAsync(httpGetSingleProduct));
productsRoute.get('/min/max/price',httpGetProductsByPrice)
productsRoute.get('/stats' , httpGetProductsStats);
productsRoute.get('/company',httpGetProductsForEachCompany)

productsRoute.use(catchAsync(authenticate));
productsRoute.use(authorized('admin'));
productsRoute.post('/' , catchAsync(httpCreateNewProduct));
productsRoute.patch('/update/:productid' , catchAsync(httpUpdateProduct));
productsRoute.delete('/:productid' , catchAsync(httpDeleteOneProduct));
module.exports= productsRoute;