const appError = require('./class_handle_error');
require('dotenv').config();



function sendDevError (err ,res) {
  return res.status(err.statusCode).json({
    status:err.status,
    message : err.message,
    error :err,
    stack : err.stack,
  })
}


function sendProError (err ,res) {
  if(err.isOperation) {
    return res.status(err.statusCode).json({
      status: err.status,
      message:err.message,
    })
  }
  else {
    console.log('ERROR',err);
    return res.status(err.statusCode).json({
      status: err.status,
      message:'Something went wrong'
    })
  }

}

function handelErrorMiddleware (err , req , res , next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status ||  'fail';
 
  if(process.env.NODE_ENV ==='development')
  {
   sendDevError(err , res);
  }
  else if(process.env.NODE_ENV ==='production') {
    let error = Object.assign(err);

    sendProError(error , res);

  }
 
}

module.exports = handelErrorMiddleware;