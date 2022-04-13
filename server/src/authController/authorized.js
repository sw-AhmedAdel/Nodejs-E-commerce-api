const appError= require('../handelErrors/class.handel.error');

const authorized = (...roles) => {
   return (req ,res, next) => {
     if(!roles.includes(req.user.role)) {
      return next (new appError('You do not have permission to do this action', 401));
    }
    next();

    
   }
}

module.exports = authorized;