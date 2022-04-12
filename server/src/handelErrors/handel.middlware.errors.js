const appError = require('./class.handel.error');
require('dotenv').config();



function handelDublicateData(error) {
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
      status: err.status,
      message : err.message,
    })
  }else {
   console.log('Error' , err);
   return res.status(res.statusCode).json({
    status: 'fail',
    message : 'something went wrong'
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
     let error = Object.assign(err);
    
     if(error.statusCode ===500) {
       error = handelDublicateData(error);
     }
    
     sendProdError(error, res);    
   } 
}

module.exports= handelErrorMiddleware;
