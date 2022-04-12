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

const auth = require('../../authController/auth');
const admin = require('../../authController/admin');
 
userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));

 
userRoute.use(auth);
userRoute.patch('/update/me', catchAsync(httpUpdateUSer));
userRoute.delete('/delete/me', catchAsync(httpDeleteUser));
userRoute.get('/logout', httpLogout);



userRoute.get('/get/user/:id' , catchAsync(httpGetOneUser));
userRoute.get('/'  , catchAsync(httpGetAllUsers));
module.exports = userRoute;
