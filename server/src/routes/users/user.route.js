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
  httpDeleteUser,
  httpVerifyAccount
} = require('./user.controller');


const  {
  httpForgotPassword,
  httpResetPassword,
  httpUpdatePassword
} = require('../../password/password');

const {
  catchAsync
} =require('../../services/query');

const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');
 
userRoute.post('/signup' , catchAsync(httpCreateUSer));
userRoute.post('/login' , catchAsync(httpLoginUser));
userRoute.post('/forgotpassword' ,  catchAsync(httpForgotPassword));
userRoute.patch('/resetpassword/:token' , catchAsync(httpResetPassword));
userRoute.get('/verifyemail/:token', catchAsync(httpVerifyAccount));
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
