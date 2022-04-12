const mongoose = require('mongoose');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const userScheam = new mongoose.Schema({

  name:{
    type: String,
    required:[true , 'User must have a name'],
    minlength:[4,'User name must have more or equal 6 chars '],
    maxlength:[30,'User name must be leass  or equal 15 chars '],
  },
   email: {
     type: String,
     required: [true,' please provide email'],
     unique: true,
     validate: [validator.isEmail,'Invalid email']
   }
   ,
  password: {
    type:String ,
    required: [true, 'please provide your  password'],
    minlength : 8,
  },
  passwordConfirm: {
    type:String ,
    required: [true, 'please provide your  password'],
    minlength : 8,
    validate : {
      validator: function(val) {
        return val === this.password;
      }
      ,
      message: 'passwords are not the same',
    }
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default:'user',
  },
   active: {
     type: Boolean,
     default: true,
   },
   passwordChangedAt : Date,
   passwordResetToken : String,
   passwordTokenExpires: Date,
},{
  timestamps:true
})


userScheam.methods.toJSON= function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;;
  return userObject;
}




userScheam.methods.changePasswordAfter = function(jwtTime) {
   const user = this;
   if(user.passwordChangedAt) {
   const userPasswordTime = parseInt(user.passwordChangedAt.getTime() /1000 , 10);
   return jwtTime << userPasswordTime
   }
   return false;
}

userScheam.pre('save' , function(next){
  if(this.isNew || !this.isModified('password'))
  {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

userScheam.methods.createpasswordResetToken = async function () {
  const user = this;
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken= crypto.createHash('sha256').update(token).digest('hex');
  user.passwordTokenExpires = Date.now() + 10 * 60 * 1000; // 10 mints
  await user.save(); 
  return token;
}

userScheam.methods.comparePassword = async function( candidatePassword , currentPassword) {
  return await bcrypt.compare(candidatePassword , currentPassword);
}

userScheam.statics.findByrCedenitals= async function(email , password) {
  const user = await User.findOne({
    email
  })
  if(!user){
    return false;
  }

  const isMatch = await bcrypt.compare(password , user.password);
  if(!isMatch){
    return false;
  }
  return user;
}

userScheam.methods.getAuthToken = function() {
  const user = this;
  const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET ,{expiresIn:process.env.JWT_EXPIRES_IN})
  return token;
}

userScheam.pre('save' , async function(next) {
  const user = this;
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = undefined;
  }

  next();
})


userScheam.pre(/^find/ , function(next) {
  this.find({active: {$ne : false}})
  next();
})

const User = mongoose.model('User' , userScheam);
module.exports= User;

