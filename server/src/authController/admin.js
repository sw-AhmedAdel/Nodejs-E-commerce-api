const appError= require('../handelErrors/class.handel.error');

const admin = (...role) => {
  return (req , res, next) => {
    if(!role.includes(req.user.role)) {
      return next (new appError('You do not have permission to do this action'));
    }
  }
  next();
}

module.exports = admin;