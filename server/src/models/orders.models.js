const orders= require('./orders.mongo');

async function CreateOrder(order) {
 
  const newOrder = await orders.create(order);
  return newOrder
}

async function GetALLOrders(filter){
  return await orders.find(filter);
}

async function FindOurder (id) {
  return await orders.findOne({
    _id : id
  })
}
module.exports = {
  CreateOrder,
  GetALLOrders,
  FindOurder
}
