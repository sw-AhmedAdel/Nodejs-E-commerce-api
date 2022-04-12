const {
  CreateUSer,
  GetAllUsers,
  FindUser,
  findByrCedenitals,
  UpdateUSer,
  DeleteUser
} = require('../../models/user.models');
const sendCookieToRespond = require('../../authController/cookie');
const appError = require('../../handelErrors/class.handel.error');
const emails = require('../../services/emails');

function filterUser (obj , ...arr) {
  const filter = {};
  Object.keys(obj).forEach((el) => {
    if(arr.includes(el)){
      filter[el] = obj[el]
    }
  })
  return filter;
}

async function httpMyProfile (req , res ,next) {
  const user = req.user;
  return res.status(200).json({
    user,
  })
}

async function httpCreateUSer(req , res ,next) {
  const user = req.body;
  const newUser = await CreateUSer(user);
  const url =`${req.protocol}://${req.get('host')}/products`;
  await new emails(newUser , url).sendWelcome();
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

async function httpGetOneUser (req , res ,next) {
  const id = req.params.id;
  const user = await FindUser(id);
  if(!user) {
    return next(new appError('User is not exits', 404));
  }
  return res.status(200).json({
    user,
  })
}


async function httpUpdateUSer (req , res , next) {
  
  if(req.body.password || req.body.passwordConfirm) {
   return next(new appError('please update password from v1/users/updatepassword', 400));
  }
 
  const id = req.user._id;
  const filter = filterUser(req.body , 'name','email');
 
  const user =await UpdateUSer(filter , id);
  return res.status(200).json({
    status:'success',
    user
  })
}

async function httpDeleteUser(req , res ,next) {
 
  const id = req.user._id; 
  await DeleteUser(id);
  const url =`${req.protocol}://${req.get('host')}/signup`;
  await new emails(req.user , url).DeleteUser();
  return res.status(200).json({
    status:'success',
    messae:'Your account has been deleted'
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

function httpLogout(req , res ) {
  res.cookie('token' , 'Logout', {
    httpOnly : true,
    expires: new Date(Date.now())
  })
  if( process.env.NODE_ENV === 'development'){
    return res.status(200).json({
      status:'success',
      messae:'You loged out'
    })
   } 
}



module.exports = {
  httpMyProfile,
  httpCreateUSer,
  httpGetAllUsers,
  httpLoginUser,
  httpLogout,
  httpGetOneUser,
  httpUpdateUSer,
  httpDeleteUser
}