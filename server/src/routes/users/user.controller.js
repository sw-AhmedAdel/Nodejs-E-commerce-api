const {
  CreateUSer,
  GetAllUsers,
  FindUser,
  findByrCedenitals
} = require('../../models/user.models');
const sendCookieToRespond = require('../../authController/cookie');
const appError = require('../../handelErrors/class.handel.error');
 
async function httpCreateUSer(req , res ,next) {
  const user = req.body;
  const newUser = await CreateUSer(user);
  sendCookieToRespond(newUser , res);
  return res.status(201).json({
    newUser,
  })
}

async function httpGetAllUsers(req, res ,next) {
  const users = await GetAllUsers();
  return res.status(200).json({
    status:'success',
    data: users
  })
}

async function httpLoginUser (req , res ,next) {
  const {email , password} = req.body;
  if(!email || !password) {
    return next(new appError ('Please provide us your email and password', 400));
  }

  const user = await findByrCedenitals(email , password);
  if(!user) {
    return next(new appError ('Unable to login', 404));
  }
  sendCookieToRespond(user , res);
  return res.status(201).json({
    user,
  })

 
}

module.exports = {
  httpCreateUSer,
  httpGetAllUsers,
  httpLoginUser
}