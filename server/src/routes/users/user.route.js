const express = require('express');
const userRoute = express.Router();
const {
  httpCreateUSer,
  httpGetAllUsers,
  httpLoginUser,
  httpLogout,
  httpGetOneUser
} = require('./user.controller');

const {
  catchAsync
} =require('../../services/query');

userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));

userRoute.get('/', catchAsync(httpGetAllUsers));
userRoute.get('/logout', httpLogout);

userRoute.get('/get/user/:id' , catchAsync(httpGetOneUser));
module.exports = userRoute;
