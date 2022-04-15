const express = require('express');
const orderRoute = express.Router();
const {
httpCreateOrder,
httpGetALLOrders,
httpGetCurrentUserOrders,
httpSingleOrder,
} = require('./orders.controller');

const {
  catchAsync,
} =require('../../services/query');

const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');


orderRoute.use(catchAsync(authenticate));

orderRoute.post('/'  , catchAsync( httpCreateOrder));
orderRoute.get('/current/user' , catchAsync(httpGetCurrentUserOrders));
orderRoute.get('/order/:orderid' ,catchAsync( httpSingleOrder));
 
orderRoute.use(authorized('admin'));
orderRoute.get('/' , catchAsync( httpGetALLOrders));

module.exports= orderRoute;