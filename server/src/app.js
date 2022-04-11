const express = require('express');
const app = express();
const handelErrorMiddleware = require('./services/function_handel_error');
const api =require('./routes/api');
const cookieParser = require('cookie-parser');

app.use(handelErrorMiddleware);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // maek cookie more secure
//to get the cookie it will be attached on the res.signedCookies
app.use('/v1' , api);
module.exports= app;