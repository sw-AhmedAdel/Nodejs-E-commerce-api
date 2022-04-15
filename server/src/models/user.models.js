 const User = require('./user.mongo');

async function CreateUSer (user) {
  const newUSer = new User(user); // await User.create(user)
  await newUSer.save();
  const token = await newUSer.createverificationToken();
  return token;
}

async function GetAllUsers() {
  return await User.find();
}

async function FindUser (filter){
 return await User.findOne(filter)
}

async function findByrCedenitals(email , password) {
  return await User.findByrCedenitals(email , password);
}

async function UpdateUSer (Updateuser , id) {
  const user = await User.findByIdAndUpdate(id , Updateuser , {
    new:true,
    runValidators:true,
  })
  return user;
}


async function DeleteUser (id) {
  const user = await User.findByIdAndUpdate(id , {
    active: false
  })
  
  return user.acknowledgement === true;
}


module.exports = {
  CreateUSer,
  GetAllUsers,
  FindUser,
  findByrCedenitals,
  UpdateUSer,
  DeleteUser
}