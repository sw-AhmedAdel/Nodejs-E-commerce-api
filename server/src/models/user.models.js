const User = require('./user.mongo');

async function CreateUSer (user) {
  const newUSer = new User(user); // await User.create(user)
  await newUSer.save();
  return newUSer;
}

async function GetAllUsers() {
  return await User.find();
}

async function FindUser (userId){
 return await User.findOne({
   _id : userId
 })
}

async function findByrCedenitals(email , password) {
  return await User.findByrCedenitals(email , password);
}

async function UpdateUSer (Updateuser , id) {
  const user = await User.findByIdAndUpdate(id , UpdateUSer , {
    new:true,
    runValidators:true,
  })
  return user;
}



module.exports = {
  CreateUSer,
  GetAllUsers,
  FindUser,
  findByrCedenitals,
  UpdateUSer
}