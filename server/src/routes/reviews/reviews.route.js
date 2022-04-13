const express = require('express');
const reviewsRoute = express.Router();

const {
 httpGetAllReviews,
 httpGetOneReview,
 httpCreateReview,
 httpUpdateMyReview,
 httpDeleteMyReview,
} = require('./reviews.controllers');

const {
  catchAsync
} =require('../../services/query');

const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');


reviewsRoute.get('/' , catchAsync(authenticate) ,catchAsync(httpGetAllReviews));
reviewsRoute.get('/get/review/:reviewid' , catchAsync(authenticate) , catchAsync(httpGetOneReview));
reviewsRoute.post('/:productid/review' , catchAsync(authenticate) , authorized('user') , catchAsync(httpCreateReview));
reviewsRoute.patch('/:reviewid/review', catchAsync(authenticate) ,authorized('user'), catchAsync(httpUpdateMyReview));
reviewsRoute.delete('/:reviewid/delete', catchAsync(authenticate) , catchAsync(httpDeleteMyReview));





module.exports= reviewsRoute;
