const express = require('express');
const reviewsRoute = express.Router();

const {
 httpGetAllReviews,
 httpCreateReview,
 httpUpdateMyReview,
 httpDeleteMyReview,
 httpAdminDeleteReview
} = require('./reviews.controllers');

const auth = require('../../middleware/auth');
const restrictTo = require('../../middleware/admin');

const {
  catchAsync
} = require('../../services/query');


reviewsRoute.get('/:tourid/review' , catchAsync(auth), catchAsync(httpGetAllReviews) );
reviewsRoute.post('/:tourid/review' , catchAsync(auth) , restrictTo('user') , catchAsync(httpCreateReview));
reviewsRoute.patch('/:reviewid/review', catchAsync(auth) ,restrictTo('user'), catchAsync(httpUpdateMyReview));
reviewsRoute.delete('/:reviewid/delete/my/review', catchAsync(auth) ,restrictTo('user'), catchAsync(httpDeleteMyReview));


reviewsRoute.get('/' , catchAsync(auth) , restrictTo('admin'),catchAsync(httpGetAllReviews));
reviewsRoute.delete('/:reviewid/admin/delete/review', catchAsync(auth) ,restrictTo('admin'), catchAsync(httpAdminDeleteReview));



module.exports= reviewsRoute;
