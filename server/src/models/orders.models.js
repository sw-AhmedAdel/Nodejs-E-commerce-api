const mongoose = require('mongoose');

const singleCartItemSchema = mongoose.Schema({
  name : {type: String , required: true},
  imageCover : {type: String , required: true},
  price : {type: price , required: true},
  amount : {type: price , required: true},
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
  cartItems: [ singleCartItemSchema ]
  ,
  status: {
    type:String,
    enum:['pending' , 'failed', 'paid', 'deliverd' ,'canceled'],
    default:'pending',
  }
  ,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref:'user',
    required: true,
  },
  paymentId : {
    type:String,
  }
  ,
  clientSecret: {
    type:String,
    required: true,
  }

}, {
  timestamps: true,
  toJSON: {virtuals : true},
  toObject: {virtuals : true}
})


const orders =mongoose.model('order' , orderShcema);
module.exports = orders;