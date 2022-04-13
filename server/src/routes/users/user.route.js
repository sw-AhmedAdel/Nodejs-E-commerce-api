const express = require('express');
const userRoute = express.Router();
const {
  httpMyProfile,
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

const  {
  httpForgotPassword,
  httpResetPassword,
  httpUpdatePassword
} = require('../../password/password');

const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');
 
userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));
userRoute.post('/forgotpassword' ,  catchAsync(httpForgotPassword));
userRoute.patch('/resetpassword/:token' , catchAsync(httpResetPassword));
 
userRoute.use(catchAsync(authenticate));
userRoute.get('/me', catchAsync(httpMyProfile));
userRoute.patch('/update/me', catchAsync(httpUpdateUSer));
userRoute.patch('/update/my/password', catchAsync(httpUpdatePassword));
userRoute.patch('/update/me', catchAsync(httpUpdateUSer));
userRoute.delete('/delete/me', catchAsync(httpDeleteUser));
userRoute.get('/logout', httpLogout);


userRoute.use(authorized('admin'));
userRoute.get('/get/user/:id' , catchAsync(httpGetOneUser));
userRoute.get('/'  , catchAsync(httpGetAllUsers));
module.exports = userRoute;
