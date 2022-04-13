const express = require('express');
const api = express.Router();
const userRoute= require('./users/user.route');
const productsRoute= require('./products/products.route');
const reviewsRoute = require('./reviews/reviews.route');

api.use('/reviews' , reviewsRoute)
api.use('/users' , userRoute);
api.use('/products' , productsRoute);
module.exports= api;