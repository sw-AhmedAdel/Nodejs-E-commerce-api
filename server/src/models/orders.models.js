const orders= require('./orders.mongo');

async function CreateOrder(order) {
 
  const newOrder = await orders.create(order);
  return newOrder
}

async function GetALLOrders(){
  return await orders.find();
}

module.exports = {
  CreateOrder,
  GetALLOrders
}
