const products = require('../../models/products.mongo');
const {checkPermissions} = require('../../services/query');
const appError = require('../../handelErrors/class.handel.error');
const stripe = require('stripe')(process.env.STRIPTE_SECRET_KEY);
require('dotenv').config();

const {
  CreateOrder,
  GetALLOrders,
  FindOurder
} = require('../../models/orders.models');
 

async function httpCreateOrder( req, res ,next) {
 
  const {items: cartItems , tax , shippingFee} = req.body;
  if(!cartItems || cartItems.length < 0) {
    return next(new appError('No cart Items provied'))
  }
  if(!tax || !shippingFee) {
    return next(new appError('Please provide tax and shipping Fee'))
  }
  
 let orderItems= [];
 let subTotal = 0;
 for(const item of  cartItems) {
  //get each procut from cart
  const product = await products.findOne({_id : item.product});
  if(!product) {
    return next(new appError('No product was found'))
  }
  const {price , imageCover , name ,_id} = product;
  const getSingleProduct = {
    amount : item.amount,
    name,
    price,
    imageCover,
    product: _id,
  }
  orderItems = [...orderItems , getSingleProduct];
  subTotal += price * item.amount; 

 }

 const total = subTotal + tax + shippingFee;
 // make the payments using stripe 
 const order = {
  
  subTotal,
  total,
  tax,
  shippingFee,
  orderItems,
  user:req.user._id
 }

 await getCheckoutSession( req, res,order , req.user , next)
}

async function getCheckoutSession ( req, res,order , user  , next) {

  let line_items_order = [];

  
  for(const item of order.orderItems) {// this has the all orders 
   
   const product = await products.findOne({_id :item.product })
  
   const obj = {
    name: `${item.name}`,
    description: product.description,
    amount: item.price * 100,
    currency: 'usd',
    quantity: item.amount,
   }

   line_items_order=[...line_items_order , obj];
  }
 
 
  try{
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/products`,
    customer_email: user.email,
   // client_reference_id: user._id,
    line_items:line_items_order
  });

  const newOrder= await CreateOrder(order);
  return  res.status(201).json({
    status: 'success',
    session:session,
    
  });
} catch(err) {
  return next (new appError ('Could not make the payment, please try again later', 400))
 } 
}


async function httpGetALLOrders( req, res ,next) {
  const orders = await GetALLOrders()
  return res.status(200).json({
    status:'success',
    results:orders.length,
    data: orders
  })
}


async function httpSingleOrder( req, res ,next) {
  const {orderid} = req.params;
  const order = await FindOurder(orderid);
  if(!order) {
    return next (new appError('Order was not found'));
  }

  if(!checkPermissions(req.user , order.user)) {
    return next (new appError('You do not have permissions to do this action'));
  }

  return res.status(200).json({
    status:'success',
    data : order
  })
}


async function httpGetCurrentUserOrders( req, res ,next) {
  const filter = {
    user : req.user._id
  }
  const orders = await GetALLOrders(filter);
  return res.status(200).json({
    status:'success',
    results: orders.length ,
    data: orders
  })
}




 


module.exports = {
httpCreateOrder,
httpGetALLOrders,
httpGetCurrentUserOrders,
httpSingleOrder,
 }