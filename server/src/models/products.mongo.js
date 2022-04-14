const mongoose = require('mongoose');
const productScheam = new mongoose.Schema({
  name : {
    type : String,
    required: [true, 'Product name must be provided'],
    trim :true,
    maxlength:['50', 'Name can not be more than 50 chars']
  },
  price: {
    type : Number,
    required:[true, 'Product price must be provided '],
    default:0
  },
  description:{
    type: String,
    required:[true, 'Product must have a description'],
    maxlength:['1000', 'Name can not be more than 1000 chars']
  },
  imageCover: {
    type : String,
  }
  ,
  images: {
    type: Array,
  }
  ,
  category:{
    type: String,
    required: [true, 'Product must have a category'],
    enum: {
      values:['office','kitchen','bedroom'],
      message:'{VALUE} is not supported',
    }
  }
  ,
  rating: {
    type :Number,
    default:0,
 
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
  },
  colors: {
    type: [String],
    required: true,
  }
  ,
  freeShipping : {
    type: Boolean,
    default: false,
  },

  inventory : {
    type: Number,
    default: 15,
  },
  averageRatings : {
    type: Number,
    default: 0,
  },
  
  ratingsQuantity:{
    type: Number,
    default: 0,
  }
   ,
  user: { // this points to the admin that created the product
    type: mongoose.Schema.Types.ObjectId,
    ref :'User',
    required:true,
  }
  ,
  createdAt : {
    type : Date ,
    default: Date.now(),
  }
} , {
  toJSON:{virtuals : true },
  toObject:{virtuals: true },
});

//use virtuals when i get products i want to see the all review on it 
productScheam.virtual('reviews' , {
  ref:'review',
  localField:'_id',
  foreignField:'product',
  //match: {rating : 1}
  justOne: false,
})

const products = mongoose.model('Product' , productScheam);
module.exports = products;