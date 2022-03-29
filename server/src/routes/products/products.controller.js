const {
   GetAllProducts,
} = require('../../models/products.models');

async function httpGetAllProducts (req , res) {
  const filter = req.query;
  const products = await GetAllProducts(filter);
  return res.status(200).json({
    status:'success',
    results:products.length,
    data : products
  })
}

module.exports = {
  httpGetAllProducts,
}