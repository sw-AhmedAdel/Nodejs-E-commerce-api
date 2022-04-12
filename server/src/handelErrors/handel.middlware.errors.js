const { compareSync } = require('bcrypt');
const appError = require('./class.handel.error');
require('dotenv').config();

function MongooseHandelErrors (err) {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new appError(message , 400);
}



function DublicateData(error) {
  const value = Object.values(error.keyValue);
  const message = `${value} is already exits!!`;
  return new appError(message , 400);
}

function sendDevError (err , res) {
  
  return res.status(err.statusCode).json({
    status: err.status,
    message : err.message,
    error : err,
    stack : err.stack,
  })
}

function sendProdError (err , res) {
  if(err.isOpertional) {
    return res.status(err.statusCode).json({
      status : err.status,
      message : err.message,
    })
    //any type of error i did not track it or unexpexted error, unkown error
  } else {
    console.error('ERROR', err);
    return res.status(500).json({
      error:"something went wrong"
    })
  }  
}



function handelErrorMiddleware (err , req , res , next)  {
  err.statusCode = err.statusCode || 500 ; // 500 > internal server error
  err.status = err.status || 'fail';

 
  if( process.env.NODE_ENV === 'development'){
    sendDevError(err ,res);
   } 
   else  if( process.env.NODE_ENV === 'production'  ){
      
      if(err.statusCode ===500){
        err= DublicateData(err);
      }

      if(err.name ==='ValidationError'){
        err = MongooseHandelErrors(err)
      }

       sendProdError(err, res);    
   } 
}

module.exports= handelErrorMiddleware;