const mongoose = require('mongoose');

const singleOrderItemSchema = mongoose.Schema({
  name : {type: String , required: true},
  imageCover : {type: String , required: true},
  price : {type: Number , required: true},
  amount : {type: Number , required: true},
  product: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref:'product'
  }
})

const orderShcema = new mongoose.Schema({
  tax : {
    type : Number ,
    required: true,
  },

  shippingFee : {
    type : Number ,
    required: true,
  },
  subTotal : {
    type : Number ,
    required: true,
  },
  total : {
    type : Number ,
    required: true,
  },
  orderItems: [ singleOrderItemSchema ]
  ,
  status: {
    type:String,
    //enum:['pending' , 'failed', 'paid', 'deliverd' ,'canceled'],
    default:'paid',
  }
  ,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },

  /*clientSecret: {
    type:String,
    required: true,
  }*/

}, {
  timestamps: true,
  toJSON: {virtuals : true},
  toObject: {virtuals : true}
})


/*
orderShcema.pre(/^find/ , function(next) {
  this.populate('user')
  next();
})*/



 
const Order =mongoose.model('Order' , orderShcema);
module.exports = Order;