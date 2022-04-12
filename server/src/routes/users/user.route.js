const express = require('express');
const userRoute = express.Router();
const {
  httpCreateUSer,
  httpGetAllUsers,
  httpLoginUser,
  httpLogout,
  httpGetOneUser,
  httpUpdateUSer,
  httpDeleteUser
} = require('./user.controller');

const {
  catchAsync
} =require('../../services/query');

userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));


userRoute.get('/', catchAsync(httpGetAllUsers));
userRoute.post('/update/me', catchAsync(httpUpdateUSer));
userRoute.post('/delete/me', catchAsync(httpDeleteUser));

userRoute.get('/logout', httpLogout);

userRoute.get('/get/user/:id' , catchAsync(httpGetOneUser));
module.exports = userRoute;
