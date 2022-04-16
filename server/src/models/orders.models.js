const Order= require('./orders.mongo');
const Product = require('./products.mongo')
async function CreateOrder(order) {
 
  const newOrder = await Order.create(order);
  return newOrder
}

async function GetALLOrders(filter){
  return await Order.find().populate('user');
/*
  let products = []
  const orders = await Order.find()
  for(const order of orders ){// orders is [] so iterate over it to get each order
   for(const ord of order.orderItems){//orderItems is array  coz it has many object so iterate over it 
    const product = await Product.findOne({_id : ord.product});
    products = [...products , product]
   } 
   
  }
  return products;*/
}

async function FindOurder (id) {
  return await Order.findOne({
    _id : id
  })
}
module.exports = {
  CreateOrder,
  GetALLOrders,
  FindOurder
}
