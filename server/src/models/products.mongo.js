const mongoose = require('mongoose');
const productScheam = new mongoose.Schema({
  name : {
    type : String,
    required: [true, 'Product name must be provided'],
  },
  price: {
    type : Number,
    required:[true, 'Product price must be provided '],
  },
  rating: {
    type :Number,
    default:0,
    min: [1 ,'Ratin1 ,g must be above 1'],
    max: [5,, 'Rating must be bellow or equal 5.0'],
  },
  featured : {
    type: Boolean,
    default: false,
  },
  company :{
    type : String,
    required:[true , 'Product must have a company name'],
    enum: {
      values: ['ikea','liddy','caressa','marcos'],
      message: '({VAKUE}) is not supported' ,
    }
  }
  ,
  createdAt : {
    type : Date ,
    default: Date.now(),
  }
});

const products = mongoose.model('Product' , productScheam);
module.exports = products;