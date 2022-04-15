const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  ratingsAverage : {
    type:Number,
    min:[1 , 'Rating must be above 1'],
    max:[5 ,'Rating must be bellow or equal 5.0'],
    set: val => Math.round(val * 10) / 10 // 4.7
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },

   ratingQuantity:{
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
  toJSON: {virtuals : true},
  toObject: {virtuals : true}
});

productSchema.virtual('reviews' ,{
  path:'review',
  localField:'_id',
  foreignField:'product',
  
})

productSchema.index({price: 1});
productSchema.index({company : 1});
productSchema.index({category : 1});
productSchema.pre('remove' , async function(next) {
  await this.model('review').deleteMany({product : this.product_id})
  next();
 
})

const products = mongoose.model('Product' , productSchema);
module.exports = products;