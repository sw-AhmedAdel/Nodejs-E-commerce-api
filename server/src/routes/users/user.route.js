const express = require('express');
const userRoute = express.Router();
const {
  httpCreateUSer,
  httpGetAllUsers,
  httpLoginUser,
  httpLogout
} = require('./user.controller');

const {
  catchAsync
} =require('../../services/query');

userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));

userRoute.get('/', catchAsync(httpGetAllUsers));
userRoute.get('/logout', httpLogout);
module.exports = userRoute;
