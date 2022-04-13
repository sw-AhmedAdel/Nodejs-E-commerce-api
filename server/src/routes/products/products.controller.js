const {
   GetAllProducts,
   GetProductsByPrice,
   GetProductsStats,
   GetProductsForEachCompany,
   FindProduct,
   CreateNewProduct,
   UpdateProduct
} = require('../../models/products.models');

const appError = require('../../handelErrors/class.handel.error');

const {
  getPagination,
  filterFun,  
} = require('../../services/query');

async function httpCreateNewProduct(req , res, next) {
  req.body.user = req.user._id;
  const newProduct = await CreateNewProduct(req.body);
  return res.status(201).json({
    status:'success',
    data: newProduct
  })
}

async function httpUpdateProduct(req, res , next) {
  const {productid} = req.params;
  const editProduct = req.body;
  let product = await FindProduct(productid);
  if(!product) {
    return next(new appError('this product is not exits', 400));
  }
   product = await UpdateProduct(editProduct , productid);
  return res.status(200).json({
    status:'success',
    product,
  })
}


async function httpGetSingleProduct(req , res, next) {
  const Product = await FindProduct(req.params.id);
  if(!Product) {
    return next(new appError('this product is not exits', 400));
  }
  return res.status(200).json({
    status:'success',
    data: Product
  })
}

async function httpDeleteOneProduct(req, res , next) {
  const {productid} = req.params;
  const product = await FindProduct(productid);
  if(!product) {
    return next(new appError('this product is not exits', 400));
  }
  await product.remove();
  return res.status(200).json({
    status:'success'
  })
}

async function httpGetAllProducts (req , res) {
  /*const {featurd} = req.query;
  const obj={};
  if(featurd) {
    obj.featurd ==='true' ? true : false;
  }*/
  //console.log(req.signedCookies) 
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

  const products = await GetProductsStats();
  return res.status(200).json({
    status:'success',
    data : products
  })

}

async function httpGetProductsForEachCompany(req , res) {
  const products = await GetProductsForEachCompany ();
  return res.status(200).json({
    status:'success',
    data : products
  })
}

module.exports = {
  httpCreateNewProduct,
  httpGetSingleProduct,
  httpGetAllProducts,
  httpGetProductsByPrice,
  httpGetProductsStats,
  httpGetProductsForEachCompany,
  httpUpdateProduct,
  httpDeleteOneProduct
}