const jwt =require('jsonwebtoken');
const User = require('../models/user.mongo');
const {promisify} = require('util');
const appError = require('../handelErrors/class.handel.error');
require('dotenv').config();

async function auth (req , res , next) {
  
  if(!req.signedCookies.token) {
    return next(new appError('You are not logged in! Please log in to get access.', 401));
  }
  const token = req.signedCookies.token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id : decoded._id
  });
  if (!user) {
    return next(new appError('The user belonging to this token does no longer exist.',401));
  }
  if( user.changePasswordAfter(decoded.iat)) {
    return next (  new appError('User recently changed password! Please log in again.', 401));
  }
  
  req.user = user;
  next();

}

module.exports= auth;


