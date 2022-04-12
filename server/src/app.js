const express = require('express');
const app = express();
const handelErrorMiddleware = require('./handelErrors/handel.middlware.errors');
const api =require('./routes/api');
const cookieParser = require('cookie-parser');
const appError = require('./handelErrors/class.handel.error');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // maek cookie more secure
//to get the cookie it will be attached on the res.signedCookies
app.use('/v1' , api);

app.all('*', (req , res ,next) => {
 
  return next(new appError(`could not find ${req.originalUrl} on this server`, 404));
})

app.use(handelErrorMiddleware);


module.exports= app;