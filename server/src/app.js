const express = require('express');
const app = express();
const handlingErrorMiddleware = require('./handelErrors/handel.middlware.errors');
const api =require('./routes/api');
const cookieParser = require('cookie-parser');
const appError = require('./handelErrors/class.handel.error');

//security 
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//

const limiter = rateLimit({
  max: 100 ,
  windowMs: 60 * 60 * 1000, // 1 hour
  message:'To many requests from this api/ please try again an hour'
})
app.use(limiter) // limit request
app.use(helmet()); // secure http headers
app.use(mongoSanitize());
app.use(xss());

app.use(hpp({ // 
  whitelist:['price','name','company','ratingsAverage' , 'category']
}))

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // maek cookie more secure
//to get the cookie it will be attached on the res.signedCookies
app.use('/v1' , api);

app.all('*', (req , res ,next) => {
 
  return next(new appError(`could not find ${req.originalUrl} on this server`, 404));
})

app.use(handlingErrorMiddleware);


module.exports= app;