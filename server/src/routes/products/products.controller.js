const {
   GetAllProducts,
} = require('../../models/products.models');
const {
  getPagination
} = require('../../services/query');

async function httpGetAllProducts (req , res) {
  /*const {featurd} = req.query;
  const obj={};
  if(featurd) {
    obj.featurd ==='true' ? true : false;
  }*/
  const {skip , limit} =getPagination(req.query);
  const filter = {...req.query};
  const execludeFileds = ['page', 'limit','sort','fields'];
  execludeFileds.forEach((el) => delete filter[el]);

  const products = await GetAllProducts(filter , skip , limit);
  return res.status(200).json({
    status:'success',
    results:products.length,
    data : products
  })
}

module.exports = {
  httpGetAllProducts,
}