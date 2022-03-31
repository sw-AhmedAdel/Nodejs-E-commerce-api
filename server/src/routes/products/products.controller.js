const {
   GetAllProducts,
   GetProductsByPrice,
   GetProductsStats
} = require('../../models/products.models');


const {
  getPagination,
  filterFun,
  
} = require('../../services/query');

async function httpGetAllProducts (req , res) {
  /*const {featurd} = req.query;
  const obj={};
  if(featurd) {
    obj.featurd ==='true' ? true : false;
  }*/
  try{
  const {skip , limit} =getPagination(req.query);
  const filter = {...req.query};
  const execludeFileds = ['page', 'limit','sort','fields'];
  execludeFileds.forEach((el) => delete filter[el]);
  
  const features = new filterFun(req.query , filter);
  const finalFilter = features.filterFun();
  const sort = features.sortBy();
  const fields = features.fieldsFilter();

  const products = await GetAllProducts(finalFilter , skip , limit ,sort , fields) ;
  return res.status(200).json({
    status:'success',
    results:products.length,
    data : products
  })
 }
 catch(err) {
   return res.status(400).json({
     error: 'can not get the data'
   })
 }
}

async function httpGetProductsByPrice (req , res) {
    const {min , max} = req.query;
    const products = await GetProductsByPrice(Number(min) , Number(max));
    return res.status(200).json({
      status:'success',
      data : products
    })

}

async function httpGetProductsStats (req , res) {

  const products = await getProductsStates();
  return res.status(200).json({
    status:'success',
    data : products
  })


}

module.exports = {
  httpGetAllProducts,
  httpGetProductsByPrice,
  httpGetProductsStats
}